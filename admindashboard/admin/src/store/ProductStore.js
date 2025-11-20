// admindashboard/admin/src/store/ProductStore.js
import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const useProductStore = create((set) => ({
  products: [],
  
  fetchProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      set({ products: response.data?.products || [] });
    } catch (error) {
      console.error('Fetch products error:', error);
      set({ products: [] });
    }
  },
  
  deleteProduct: async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/admin/deleteproduct/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
}));

export default useProductStore;