import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Products from "./Pages/Product.jsx";
import Users from "./Pages/User.jsx";
import Orders from "./Pages/Orders.jsx";
import AddProduct from "./Pages/AddProducts.jsx";
import AddCategory from './Pages/AddCategory';
import UpdateProduct from './Pages/UpdateProduct';
import Banners from "./Pages/Banners.jsx";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdminAccess = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const urlToken = params.get('token');
      const urlUser = params.get('user');

      if (urlToken && urlUser) {
        try {
          const decodedToken = decodeURIComponent(urlToken);
          const decodedUser = decodeURIComponent(urlUser);
          
          localStorage.setItem('token', decodedToken);
          localStorage.setItem('user', decodedUser);
          
          window.history.replaceState(null, '', window.location.pathname);
          
          const user = JSON.parse(decodedUser);
          if (user.role === 'admin') {
            setIsAdmin(true);
            return;
          }
        } catch (error) {
          console.error('Error parsing URL params:', error);
        }
      }

      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        window.location.replace('http://localhost:5173/signin');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        
        if (user.role === 'admin') {
          setIsAdmin(true);
        } else {
          window.location.replace('http://localhost:5173/signin');
        }
      } catch (error) {
        window.location.replace('http://localhost:5173/signin');
      }
    };

    checkAdminAccess();
  }, []);

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/banners" element={<Banners />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/updateproduct/:id" element={<UpdateProduct />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}