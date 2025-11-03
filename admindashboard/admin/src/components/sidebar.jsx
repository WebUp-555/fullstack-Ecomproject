import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>
      <ul className="space-y-4">
        <li><Link to="/" className="hover:text-gray-300">Dashboard</Link></li>
        <li><Link to="/products" className="hover:text-gray-300">Products</Link></li>
        <li><Link to="/users" className="hover:text-gray-300">Users</Link></li>
        <li><Link to="/orders" className="hover:text-gray-300">Orders</Link></li>
      </ul>
    </div>
  );
}
