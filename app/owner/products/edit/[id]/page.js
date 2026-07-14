'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function OwnerEditProductRedirectPage() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      router.replace(`/owner/products/${id}/edit`);
    }
  }, [id, router]);

  return (
    <div className="py-20 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
