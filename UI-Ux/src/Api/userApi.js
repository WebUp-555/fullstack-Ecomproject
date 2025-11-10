import api from "./axiosInstance.js";

export const registerUser = async (userData) => {
  try {
    const res = await api.post("/v1/users/register", userData);
    return res.data;
  } catch (error) {
    // Log the full error structure
    console.log('Register Error Full:', error);
    console.log('Register Error Response:', error.response);
    console.log('Register Error Data:', error.response?.data);
    throw error;
  }
};

export const loginUser = async (emailOrUsername, password) => {
  try {
    const isEmail = /\S+@\S+\.\S+/.test(emailOrUsername);
    const payload = isEmail
      ? { email: emailOrUsername, password }
      : { username: emailOrUsername, password };

    const response = await api.post("/v1/users/login", payload);
    return response.data;
  } catch (error) {
    // Log the full error structure
    console.log('Login Error Full:', error);
    console.log('Login Error Response:', error.response);
    console.log('Login Error Data:', error.response?.data);
    throw error;
  }
};

// logout API call — backend clears cookies and refreshToken
export const logoutUser = async () => {
  try {
    const res = await api.post("/v1/users/logout", {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.log('Logout Error:', error.response?.data);
    throw error;
  }
};