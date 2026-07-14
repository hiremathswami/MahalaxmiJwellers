'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getProducts, updateProduct } from '@/lib/panelApi';
import { 
  AlertTriangle, 
  PlusCircle, 
  RotateCw, 
  Save, 
  Layers, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminInventoryPage({ setTitle }) {
  const { accessToken } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  // Local state for stock inputs
  const [restockInputs, setRestockInputs] = useState({});
  const [gridStockInputs, setGridStockInputs] = useState({});
  
  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (setTitle) setTitle('Inventory Management');
  }, [setTitle]);

  const fetchInventory = async (showSilent = false) => {
    if (!accessToken) return;
    if (!showSilent) setLoading(true);
    try {
      const res = await getProducts(accessToken, { limit: 100 });
      if (res.success) {
        const activeProducts = res.products || [];
        setProducts(activeProducts);
        
        // Initialize inputs
        const initialRestock = {};
        const initialGrid = {};
        activeProducts.forEach(p => {
          initialRestock[p.id] = '5'; // default quick restock quantity
          initialGrid[p.id] = p.stock.toString();
        });
        setRestockInputs(initialRestock);
        setGridStockInputs(initialGrid);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to fetch inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [accessToken]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleQuickRestock = async (productId) => {
    if (!accessToken) return;
    const inputVal = restockInputs[productId];
    const addQuantity = parseInt(inputVal, 10);

    if (isNaN(addQuantity) || addQuantity <= 0) {
      showToast('Please enter a valid quantity.', 'error');
      return;
    }

    const currentProduct = products.find(p => p.id === productId);
    const newStock = (currentProduct.stock || 0) + addQuantity;

    setUpdatingId(productId);
    try {
      const res = await updateProduct(accessToken, productId, { stock: newStock });
      if (res.success && res.product) {
        showToast(`Successfully added ${addQuantity} to stock!`);
        // Update local products
        setProducts(prev => prev.map(p => p.id === productId ? res.product : p));
        setGridStockInputs(prev => ({ ...prev, [productId]: res.product.stock.toString() }));
      } else {
        showToast('Failed to update stock.', 'error');
      }
    } catch (err) {
      console.error('Error quick restocking:', err);
      showToast(err.message || 'Error occurred.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveInlineStock = async (productId) => {
    if (!accessToken) return;
    const inputVal = gridStockInputs[productId];
    const newStock = parseInt(inputVal, 10);

    if (isNaN(newStock) || newStock < 0) {
      showToast('Please enter a valid stock level.', 'error');
      return;
    }

    const currentProduct = products.find(p => p.id === productId);
    if (currentProduct.stock === newStock) {
      showToast('No changes detected.');
      return;
    }

    setUpdatingId(productId);
    try {
      const res = await updateProduct(accessToken, productId, { stock: newStock });
      if (res.success && res.product) {
        showToast(`Stock updated to ${newStock}!`);
        setProducts(prev => prev.map(p => p.id === productId ? res.product : p));
      } else {
        showToast('Failed to update stock.', 'error');
      }
    } catch (err) {
      console.error('Error saving inline stock:', err);
      showToast(err.message || 'Error occurred.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRestockInputChange = (productId, val) => {
    setRestockInputs(prev => ({ ...prev, [productId]: val }));
  };

  const handleGridInputChange = (productId, val) => {
    setGridStockInputs(prev => ({ ...prev, [productId]: val }));
  };

  // Filter low stock (stock <= 3)
  const lowStockProducts = products.filter(p => p.stock <= 3 && p.is_active);

  return (
    <div className="space-y-8 font-inter relative">
      
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

      {/* Header bar */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => fetchInventory()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.01)] cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-red-600">
          {error}
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Section 1: Low Stock Alerts */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-cormorant text-xl font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" /> Critical Low Stock Alert
            </h3>

            {lowStockProducts.length === 0 ? (
              <div className="bg-green-50 border border-green-150 p-4 rounded-xl text-xs font-semibold text-green-700">
                🎉 All products have healthy stock levels (above 3 items).
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lowStockProducts.map(p => {
                  const firstImage = p.images && p.images.length > 0 ? p.images[0] : null;
                  const isUpdating = updatingId === p.id;

                  return (
                    <div key={p.id} className="border border-red-100 rounded-xl p-4 bg-red-50/20 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {firstImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={firstImage} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400">MJ</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-gray-900 block truncate max-w-[150px] sm:max-w-[200px]">{p.name}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-150 px-1.5 py-0.5 rounded-sm block mt-1 w-max">
                            {p.stock} left
                          </span>
                        </div>
                      </div>

                      {/* Add Stock Input Form */}
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          disabled={isUpdating}
                          value={restockInputs[p.id] || '5'}
                          onChange={(e) => handleRestockInputChange(p.id, e.target.value)}
                          className="w-12 px-2 py-1 bg-white border border-gray-200 rounded-lg text-center text-xs font-bold focus:outline-hidden"
                        />
                        <button
                          onClick={() => handleQuickRestock(p.id)}
                          disabled={isUpdating}
                          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          title="Restock now"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Full Catalog Stock Table */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-cormorant text-xl font-bold text-gray-950 uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-5 h-5 text-gray-400" /> Full Stock Adjustment Grid
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Product</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Stock</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Quick Adjust</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {products.map((p) => {
                    const isUpdating = updatingId === p.id;
                    const stockVal = gridStockInputs[p.id] || '0';
                    const hasChanged = parseInt(stockVal, 10) !== p.stock;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-semibold text-gray-950 truncate max-w-xs">{p.name}</td>
                        <td className="px-6 py-4 font-medium text-gray-500 capitalize">{p.category}</td>
                        <td className="px-6 py-4">
                          <span className={`font-bold px-2 py-0.5 rounded-sm ${
                            p.stock <= 3 
                              ? 'text-red-700 bg-red-50 border border-red-100 animate-pulse' 
                              : 'text-gray-700 bg-gray-50 border border-gray-150'
                          }`}>
                            {p.stock} left
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            disabled={isUpdating}
                            value={stockVal}
                            onChange={(e) => handleGridInputChange(p.id, e.target.value)}
                            className="w-16 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-center font-semibold text-gray-950 focus:outline-hidden focus:border-gray-450 focus:bg-white"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleSaveInlineStock(p.id)}
                            disabled={isUpdating || !hasChanged}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer text-[10px] uppercase tracking-wider ${
                              hasChanged && !isUpdating
                                ? 'bg-gray-950 hover:bg-gray-850 text-white border-gray-950 shadow-sm'
                                : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                            }`}
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
