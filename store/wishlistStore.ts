import { create } from 'zustand';
import { Product } from '@/data/products';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Product) => void;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addItem: (product) => {
    set((state) => {
      if (state.items.find((item) => item.id === product.id)) {
        return state;
      }
      return { items: [...state.items, product] };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  toggleItem: (product) => {
    const isIn = get().isInWishlist(product.id);
    if (isIn) {
      get().removeItem(product.id);
    } else {
      get().addItem(product);
    }
  },

  getCount: () => {
    return get().items.length;
  },
}));
