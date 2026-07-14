'use client';

import React, { useEffect } from 'react';
import ProductForm from '@/components/panels/ProductForm';

export default function AdminNewProductPage({ setTitle }) {
  useEffect(() => {
    if (setTitle) setTitle('Add New Product');
  }, [setTitle]);

  return <ProductForm role="admin" />;
}
