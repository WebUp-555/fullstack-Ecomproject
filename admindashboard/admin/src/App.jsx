import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./Pages/Dashboard.jsx";
import Products from "./Pages/Product.jsx";
import Users from "./Pages/User.jsx";
import Orders from "./Pages/Orders.jsx";
import AddProduct from "./Pages/AddProducts.jsx";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}



