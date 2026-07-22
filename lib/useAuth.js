'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({
  user: null,
  role: null,
  accessToken: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const detectRole = (user) => {
    if (!user) return null;
    
    // 1. Check user metadata first
    if (user.user_metadata?.role) {
      return user.user_metadata.role;
    }
    
    // 2. Fallback to hardcoded roles
    const email = user.email || '';
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'rohanhiremathswami99@gmail.com' || cleanEmail === 'rohanhiremathswami73@gmail.com') return 'admin';
    if (cleanEmail === 'mjlaxmijw@gmail.com') return 'owner';
    return null;
  };

  const handleSession = useCallback((session) => {
    if (session) {
      const userRole = detectRole(session.user);
      setUser(session.user);
      setAccessToken(session.access_token);
      setRole(userRole);
    } else {
      setUser(null);
      setAccessToken(null);
      setRole(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSession]);

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
    setUser(null);
    setAccessToken(null);
    setRole(null);
    setLoading(false);
    router.push('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, role, accessToken, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default useAuth;
