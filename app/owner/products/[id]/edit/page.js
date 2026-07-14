'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/panels/ProductForm';

export default function OwnerEditProductPage({ setTitle }) {
  const { id } = useParams();

  useEffect(() => {
    if (setTitle) setTitle('Edit Product');
  }, [setTitle]);

  return <ProductForm productId={id} role="owner" />;
}
