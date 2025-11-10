import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home';
import SignIn from './Pages/signin';
import SignUp from './Pages/signup';
import Products from './Pages/Products';
import ProductDetails from './Pages/ProductsDetails';
import CartPage from './Pages/cartPage';
import PaymentPage from './Pages/PaymentPage';
import PrivateRoute from './utils/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbarOnRoutes = ['/signin', '/signup'];
  const shouldShowNavbar = !hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        {/* Public Routes - MUST BE FIRST */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/products" 
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <PrivateRoute>
              <ProductDetails />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/payment" 
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          } 
        />

        {/* Catch all - redirect to signin */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </>
  );
}

export default App;