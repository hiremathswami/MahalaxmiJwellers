'use client';

import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';

export function useAdminGuard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || role !== 'admin') {
        router.push('/login');
      }
    }
  }, [user, role, loading, router]);

  const isAuthorized = !loading && user && role === 'admin';
  return { authorized: isAuthorized, loading };
}

export function useOwnerGuard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || (role !== 'owner' && role !== 'admin')) {
        router.push('/login');
      }
    }
  }, [user, role, loading, router]);

  const isAuthorized = !loading && user && (role === 'owner' || role === 'admin');
  return { authorized: isAuthorized, loading };
}
export default { useAdminGuard, useOwnerGuard };
