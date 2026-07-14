'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getProducts, deleteProduct } from '@/lib/panelApi';
import ProductTable from '@/components/panels/ProductTable';
import ConfirmModal from '@/components/panels/ConfirmModal';
import { useRouter } from 'next/navigation';
import { Search, PlusCircle, RotateCw, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsPage({ setTitle }) {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Categories
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Deletion Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Anklets', 'Custom'];

  useEffect(() => {
    if (setTitle) setTitle('Products Catalog');
  }, [setTitle]);

  const fetchProductsData = async (showSilent = false) => {
    if (!accessToken) return;
    if (!showSilent) setLoading(true);
    try {
      // Fetch products, including inactive ones for inventory, but wait, the GET /api/products returns active ones by default.
      // Wait, getProducts allows fetching all. Let's see if the backend route filters is_active = true.
      // Yes, route.js filters eq('is_active', true). So we fetch all active products.
      const res = await getProducts(accessToken, { limit: 100 });
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, [accessToken]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleEditProduct = (productId) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleDeleteClick = (productId) => {
    const product = products.find(p => p.id === productId);
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!accessToken || !productToDelete) return;
    
    setDeleting(true);
    try {
      const res = await deleteProduct(accessToken, productToDelete.id);
      if (res.success) {
        showToast(`Product "${productToDelete.name}" deleted successfully!`);
        // Remove from local state
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      } else {
        showToast('Failed to delete product. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast(err.message || 'Error occurred while deleting product', 'error');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    if (activeCategory !== 'All') {
      if ((product.category || '').toLowerCase() !== activeCategory.toLowerCase()) {
        return false;
      }
    }

    // 2. Search Filter (product name)
    if (search.trim()) {
      return (product.name || '').toLowerCase().includes(search.toLowerCase().trim());
    }

    return true;
  });

  return (
    <div className="space-y-6 font-inter relative">
      
      {/* Toast Alert */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border transition-all animate-in slide-in-from-bottom-5 duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Confirm Soft Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This will deactivate the product from the storefront. This action can be undone by editing the product.`}
        confirmText="Deactivate"
        isDestructive={true}
        isLoading={deleting}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 placeholder-gray-400 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => fetchProductsData()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-950 hover:bg-gray-850 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto flex scrollbar-none">
        <div className="flex space-x-6">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count = cat === 'All' 
              ? products.length 
              : products.filter(p => (p.category || '').toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pb-4 px-1 text-xs font-bold uppercase tracking-wider relative transition-colors cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-gray-950' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span>{cat}</span>
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  isActive ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-950 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table view */}
      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-red-600">
          {error}
        </div>
      ) : (
        <ProductTable 
          products={filteredProducts} 
          role="admin" 
          onEditClick={handleEditProduct} 
          onDeleteClick={handleDeleteClick} 
        />
      )}
    </div>
  );
}
