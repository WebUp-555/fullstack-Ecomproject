import axios from './axiosInstance';

export const getProducts = async () => {
  const res = await axios.get('/products');
  return res.data?.products || res.data?.data?.products || [];
};

export const getProductById = async (id) => {
  const res = await axios.get(`/products/${id}`);
  return res.data?.product || res.data?.data?.product || null;
};

export const getCategories = async () => {
  const res = await axios.get('/categories');
  return res.data?.categories || res.data?.data?.categories || [];
};

export const updateAccountDetails = async (username, email) => {
  const res = await axios.put('/users/update-account', { username, email });
  return res.data;
};
