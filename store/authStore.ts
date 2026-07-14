import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string;
  phone: string | null;
  created_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  updateProfile: (name: string, phone: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,
  error: null,

  clearError: () => set({ error: null }),

  initialize: async () => {
    if (get().initialized) return;
    set({ loading: true, error: null });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        set({ user: session.user, profile: profile || null });
      }
    } catch (err: any) {
      console.error('Error initializing auth session:', err);
    } finally {
      set({ loading: false, initialized: true });
    }

    // Set up auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        let { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (!profile) {
          // Auto-create profile for OAuth/Google users
          const name = session.user.user_metadata?.full_name || 
                       session.user.user_metadata?.name || 
                       session.user.email?.split('@')[0] || 
                       'User';
          const { error: profileErr } = await supabase.from('profiles').upsert({
            id: session.user.id,
            name: name,
            phone: session.user.phone || null
          });
          
          if (!profileErr) {
            const { data: newProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            profile = newProfile;
          } else {
            console.error('Error creating profile for Google/OAuth user:', profileErr);
          }
        }
        
        set({ user: session.user, profile: profile || null, loading: false });
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, profile: null, loading: false });
      }
    });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (data.user) {
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileErr && profileErr.code !== 'PGRST116') { // PGRST116 is single row empty
          console.error('Error fetching profile:', profileErr);
        }
        set({ user: data.user, profile: profile || null });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to sign in.' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (name, email, phone, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
          }
        }
      });
      if (error) throw error;

      if (data.user) {
        // Use upsert to avoid race condition with auth state change listener
        const { error: profileErr } = await supabase.from('profiles').upsert({
          id: data.user.id,
          name,
          phone,
        });
        if (profileErr) {
          console.error('Error creating user profile:', profileErr.message || profileErr);
        }

        // Fetch it back
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        set({ user: data.user, profile: profile || null });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to sign up.' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null });
    } catch (err: any) {
      set({ error: err.message || 'Failed to sign out.' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateProfile: async (name, phone) => {
    const user = get().user;
    if (!user) throw new Error('No user is currently signed in.');
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name,
        phone,
      });
      if (error) throw error;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      set({ profile: profile || null });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update profile.' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
