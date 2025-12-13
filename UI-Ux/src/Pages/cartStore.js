import { create } from 'zustand';
import { addToCart, removeFromCart, getCart } from '../Api/cartApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const SERVER_URL = API_BASE.replace(/\/api\/v1\/?$/, "");

export const useCartStore = create((set, get) => ({
  cartItems: [],
  totalAmount: 0,
  loading: false,
  error: null,

  // Fetch cart from backend
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getCart();
      const items = data.cart?.items || [];

      const formattedItems = items.map((item) => {
        let imageUrl = item.product?.image || item.product?.productImage || null;
        
        console.log('Raw Image URL:', imageUrl); // DEBUG
        
        // If image exists, ensure it's a full URL
        if (imageUrl) {
          if (imageUrl.startsWith('http')) {
            // Already absolute (Cloudinary or external)
            // Keep as is
          } else if (imageUrl.startsWith('/')) {
            // Relative path - prepend server URL
            imageUrl = SERVER_URL + imageUrl;
          } else {
            // No slash - prepend server URL with /
            imageUrl = SERVER_URL + '/' + imageUrl;
          }
        } else {
          imageUrl = '/placeholder.png';
        }

        console.log('Final Image URL:', imageUrl); // DEBUG

        return {
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: imageUrl,
          quantity: item.quantity,
          stock: item.product.stock,
          category: item.product.category,
        };
      });

      set({
        cartItems: formattedItems,
        totalAmount: data.totalAmount || 0,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch cart',
        loading: false,
      });
    }
  },

  // Add to cart
  addToCart: async (product, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      await addToCart(product.id || product._id, quantity);
      await get().fetchCart(); // Refresh cart
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add to cart',
        loading: false,
      });
      throw error;
    }
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    set({ loading: true, error: null });
    try {
      await removeFromCart(productId);
      await get().fetchCart(); // Refresh cart
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to remove from cart',
        loading: false,
      });
    }
  },

  // Increase quantity
  increaseQuantity: async (productId) => {
    const item = get().cartItems.find((i) => i.id === productId);
    if (!item) return;

    if (item.quantity >= item.stock) {
      set({ error: 'Insufficient stock available' });
      return;
    }

    set({ loading: true, error: null });
    try {
      await addToCart(productId, 1);
      await get().fetchCart();
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update quantity',
        loading: false,
      });
    }
  },

  // Decrease quantity
  decreaseQuantity: async (productId) => {
    const item = get().cartItems.find((i) => i.id === productId);
    if (!item) return;

    if (item.quantity === 1) {
      await get().removeFromCart(productId);
      return;
    }

    set({ loading: true, error: null });
    try {
      await addToCart(productId, -1);
      await get().fetchCart();
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update quantity',
        loading: false,
      });
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));