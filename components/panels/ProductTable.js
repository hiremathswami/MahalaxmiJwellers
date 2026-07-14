import React from 'react';
import { Sparkles, Edit, Trash2 } from 'lucide-react';

export default function ProductTable({ products, role, onEditClick, onDeleteClick }) {
  
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h4 className="font-cormorant text-xl font-bold text-gray-950 mb-1">No Products Found</h4>
        <p className="text-xs text-gray-500 max-w-sm">No products match your search or filter options. Add new products to populate the table.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Image</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Name</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Price</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Weight</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
            {products.map((product) => {
              const isLowStock = product.stock <= 3;
              const hasImages = product.images && product.images.length > 0;
              const firstImage = hasImages ? product.images[0] : null;

              return (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Thumbnail Image */}
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative flex items-center justify-center">
                      {firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={firstImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">MJ</span>
                      )}
                    </div>
                  </td>
                  
                  {/* Product Name */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-950 max-w-xs truncate">{product.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">{product.id.substring(0, 8)}</div>
                  </td>
                  
                  {/* Category */}
                  <td className="px-6 py-4 font-semibold text-gray-600 capitalize">
                    {product.category || 'N/A'}
                  </td>
                  
                  {/* Price */}
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-950">₹{Number(product.price).toLocaleString('en-IN')}</span>
                    {product.original_price && (
                      <span className="text-[10px] text-gray-400 line-through ml-1.5 block sm:inline">
                        ₹{Number(product.original_price).toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>
                  
                  {/* Weight */}
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {product.weight_grams ? `${product.weight_grams} g` : 'N/A'}
                  </td>
                  
                  {/* Stock (red if <= 3) */}
                  <td className="px-6 py-4">
                    <span className={`font-bold px-2 py-1 rounded-sm text-[11px] ${
                      isLowStock 
                        ? 'text-red-700 bg-red-50 border border-red-100 font-extrabold animate-pulse' 
                        : 'text-gray-700 bg-gray-50 border border-gray-100'
                    }`}>
                      {product.stock} left
                    </span>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border ${
                      product.is_active 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditClick(product.id)}
                        className="p-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 rounded-lg font-bold text-gray-700 transition-all cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      
                      {role === 'admin' && (
                        <button
                          onClick={() => onDeleteClick(product.id)}
                          className="p-1.5 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200 rounded-lg font-bold transition-all cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
