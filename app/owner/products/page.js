'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getProducts, deleteProduct } from '@/lib/panelApi';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Package,
  Layers,
  ArrowRight,
  Trash2
} from 'lucide-react';

function OwnerProductsPageContent({ setTitle }) {
  const { accessToken } = useAuth();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    if (setTitle) setTitle('Jewellery Product Inventory');
  }, [setTitle]);

  const fetchProducts = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const res = await getProducts(accessToken, { limit: 100 });
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      console.error('Error fetching owner products:', err);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchProducts();
    }
  }, [accessToken]);

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        setLoading(true);
        const res = await deleteProduct(accessToken, productId);
        if (res.success) {
          alert('Product deleted successfully.');
          fetchProducts();
        } else {
          alert(res.error || 'Failed to delete product.');
        }
      } catch (err) {
        console.error('Delete product error:', err);
        alert('An error occurred while deleting the product.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Categories list
  const categoriesList = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Pendants', 'Anklets', 'Custom'];

  // Filter & Search Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.metal || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesLowStock = filterParam === 'low' ? p.stock <= 4 : true;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Stock Summary Counts
  const totalStockCount = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.stock <= 4).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-inter pb-12">
      {/* Premium Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <h2 className="font-cormorant text-3xl font-bold tracking-wide">Product Catalog</h2>
          <p className="text-gray-400 text-xs font-light">Monitor inventory levels, update specifications, and manage storefront listings.</p>
        </div>
        <Link
          href="/owner/products/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Top Inventory Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Pieces Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-0.5 duration-300">
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Total Pieces in Stock</span>
            <span className="text-3xl font-bold text-gray-950 block">{totalStockCount} pieces</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-600 shadow-inner">
            <Package className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-0.5 duration-300">
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Low Stock Alerts</span>
            <span className="text-3xl font-bold text-amber-600 block">{lowStockCount} items</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100/50 flex items-center justify-center text-amber-600 shadow-inner">
            <AlertTriangle className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Out of Stock Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-0.5 duration-300">
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">Out of Stock</span>
            <span className="text-3xl font-bold text-red-600 block">{outOfStockCount} items</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100/50 flex items-center justify-center text-red-600 shadow-inner">
            <XCircle className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.01)]">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID or metal type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-xs font-semibold focus:outline-hidden focus:bg-white focus:border-gray-300 transition-all duration-300"
          />
        </div>

        <div className="relative w-full sm:w-56 shrink-0">
          <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-700 focus:outline-hidden focus:bg-white focus:border-gray-300 transition-all duration-300 appearance-none cursor-pointer"
          >
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white border border-gray-150 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4 shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="font-cormorant text-2xl font-bold text-gray-950 mb-1">No Products Found</h4>
            <p className="text-xs text-gray-400 font-light">Try adjusting your search criteria or categories filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock Status</th>
                  <th className="py-4 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredProducts.map(p => {
                  const isLow = p.stock <= 4 && p.stock > 0;
                  const isOut = p.stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/20 transition-colors duration-150">
                      {/* Product Name & ID */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4.5">
                          {p.images && p.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-12 h-12 object-cover rounded-xl border border-gray-100 bg-gray-50 shadow-sm"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-950 text-sm block tracking-wide">{p.name}</span>
                              {(p.is_bestseller || p.isBestSeller) && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shadow-2xs">
                                  ★ Bestseller
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Material details */}
                      <td className="py-4 px-6 font-semibold text-gray-600">
                        <div>
                          <span className="text-xs block capitalize">{p.category}</span>
                          <span className="text-[10px] text-gray-400 font-normal block mt-0.5">{p.metal} · {p.stone}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-bold text-gray-950 text-sm">
                        ₹{Number(p.price || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Stock Level indicator */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                              <XCircle className="w-3.5 h-3.5" /> Out of stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                              <AlertTriangle className="w-3.5 h-3.5" /> Low Stock ({p.stock})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" /> In stock ({p.stock})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-8 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <Link 
                            href={`/owner/products/${p.id}/edit`} 
                            className="inline-flex items-center gap-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-gray-700 font-bold text-[11px] transition-all cursor-pointer"
                          >
                            <span>Manage</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          
                          <button 
                            onClick={() => handleDelete(p.id, p.name)}
                            className="inline-flex items-center justify-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OwnerProductsPage(props) {
  return (
    <Suspense fallback={
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OwnerProductsPageContent {...props} />
    </Suspense>
  );
}
