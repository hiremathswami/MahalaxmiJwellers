'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { getProduct, createProduct, updateProduct, uploadImage } from '@/lib/panelApi';
import { useRouter } from 'next/navigation';
import { Upload, X, Save, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function ProductForm({ productId, role = 'admin' }) {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('rings');
  const [weightGrams, setWeightGrams] = useState('');
  const [purity] = useState('925'); // Read-only
  const [stock, setStock] = useState('0');
  const [isCustom, setIsCustom] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [images, setImages] = useState([]);
  
  // Specification states
  const [metal, setMetal] = useState('');
  const [stone, setStone] = useState('');
  const [gender, setGender] = useState('unisex');

  const categories = ['rings', 'necklaces', 'earrings', 'bracelets', 'anklets', 'custom'];

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId || !accessToken) return;
      try {
        setFetching(true);
        const res = await getProduct(accessToken, productId);
        if (res.success && res.product) {
          const p = res.product;
          setName(p.name || '');
          setDescription(p.description || '');
          setPrice(p.price !== undefined ? p.price.toString() : '');
          setOriginalPrice(p.original_price !== undefined && p.original_price !== null ? p.original_price.toString() : '');
          setCategory(p.category || 'rings');
          setWeightGrams(p.weight_grams !== undefined && p.weight_grams !== null ? p.weight_grams.toString() : '');
          setStock(p.stock !== undefined ? p.stock.toString() : '0');
          setIsCustom(!!p.is_custom);
          setIsActive(!!p.is_active);
          setIsBestSeller(!!p.is_bestseller);
          setImages(p.images || []);
          setMetal(p.metal || '');
          setStone(p.stone || '');
          setGender(p.gender || 'unisex');
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product for edit:', err);
        setError('Failed to load product details.');
      } finally {
        setFetching(false);
      }
    };

    fetchProductDetails();
  }, [productId, accessToken]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadPromises = files.map(file => uploadImage(accessToken, file));
      const results = await Promise.all(uploadPromises);

      const urls = results.filter(res => res.success).map(res => res.url);
      setImages(prev => [...prev, ...urls]);

      if (urls.length < files.length) {
        setError('Some images failed to upload.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      setError('An error occurred during image upload.');
    } finally {
      setUploading(false);
      // Reset input element
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!name.trim()) {
      setError('Product Name is required.');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      setError('Please enter a valid price.');
      return;
    }
    if (images.length === 0) {
      setError('At least one product image is required.');
      return;
    }

    setLoading(true);

    // Prepare payload
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: Number(price),
      original_price: originalPrice && !isNaN(Number(originalPrice)) ? Number(originalPrice) : null,
      category: category.toLowerCase(),
      weight_grams: weightGrams && !isNaN(Number(weightGrams)) ? Number(weightGrams) : null,
      purity,
      stock: parseInt(stock, 10) || 0,
      is_custom: isCustom,
      is_active: isActive,
      is_bestseller: isBestSeller,
      images,
      metal,
      stone,
      gender: gender.toLowerCase()
    };

    try {
      let res;
      if (productId) {
        res = await updateProduct(accessToken, productId, payload);
      } else {
        res = await createProduct(accessToken, payload);
      }

      if (res.success) {
        if (role === 'owner') {
          alert('Product details saved successfully!');
          router.push('/owner/products');
        } else {
          router.push('/admin/products');
        }
      } else {
        setError(res.error || 'Failed to save product details.');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.01)] font-inter">
      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span className="text-xs font-semibold text-red-700">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Fields Column */}
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="EX: Royal Heritage Solitaire Ring"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Product Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe craftsmanship details, measurements, matching sets, and packaging..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Price ₹ *
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2499"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Original Price ₹ (Crossed-out price before discount)
              </label>
              <input
                type="number"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="3499 (leaves Price as the offered/discounted price)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 capitalize focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Target Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 capitalize focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
              >
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Weight (grams)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={weightGrams}
                onChange={(e) => setWeightGrams(e.target.value)}
                placeholder="EX: 4.52"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Metal and Stone Specifications */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Metal Type
              </label>
              <input
                type="text"
                value={metal}
                onChange={(e) => setMetal(e.target.value)}
                placeholder="EX: 925 Sterling Silver"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Stone / Gem Type
              </label>
              <input
                type="text"
                value={stone}
                onChange={(e) => setStone(e.target.value)}
                placeholder="EX: Diamond"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Fields Column */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Silver Purity
                </label>
                <input
                  type="text"
                  readOnly
                  value={purity}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 cursor-not-allowed select-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-950 focus:outline-hidden focus:border-gray-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Settings toggles */}
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-gray-950 block">Custom Order?</span>
                  <span className="text-[10px] text-gray-400 block">Flag this piece as made-to-order only.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isCustom}
                  onChange={(e) => setIsCustom(e.target.checked)}
                  className="w-4 h-4 accent-gray-950"
                />
              </div>

              <div className="flex items-center justify-between border-t border-gray-150 pt-4">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-gray-950 block">Active Status</span>
                  <span className="text-[10px] text-gray-400 block">Uncheck to hide it from customer storefront catalog.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-gray-950"
                />
              </div>

              <div className="flex items-center justify-between border-t border-gray-150 pt-4">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-gray-950 block">Bestseller Product?</span>
                  <span className="text-[10px] text-gray-400 block">Flag this piece as a bestseller on the home page.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="w-4 h-4 accent-gray-950"
                />
              </div>
            </div>
          </div>

          {/* Product Image Uploader */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Product Images * (Min 1)
            </span>
            
            <div className="grid grid-cols-4 gap-3">
              {images.map((url, index) => (
                <div key={url} className="w-16 h-16 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden relative flex-shrink-0 flex items-center justify-center group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {/* Image upload drop box */}
              {images.length < 8 && (
                <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
                  {uploading ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span className="text-[8px] font-bold uppercase tracking-wider mt-1">Add</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={uploading}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Submission Controls */}
      <div className="border-t border-gray-100 pt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            if (role === 'owner') {
              router.push('/owner/products');
            } else {
              router.push('/admin/products');
            }
          }}
          className="px-5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || uploading}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-gray-950 hover:bg-gray-850 active:bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>{productId ? 'Update Product' : 'Create Product'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
