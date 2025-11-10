// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // ✅ Changed from 9000 to 8000
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor for debugging
api.interceptors.request.use((request) => {
  console.log("Request:", request);
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