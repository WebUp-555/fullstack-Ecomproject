// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
  withCredentials: true
});

// Add interceptor for debugging
api.interceptors.request.use((request) => {
  console.log("FINAL URL:", (request.baseURL || "") + request.url);
  return request;
});

// Add interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error Details:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response?.status;
    enhancedError.data = error.response?.data;
    enhancedError.response = error.response;
    return Promise.reject(enhancedError);
  }
);

export default api;