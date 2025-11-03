import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";



export default function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImage = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in product) {
      formData.append(key, product[key]);
    }

    await axios.post("http://localhost:4000/api/v1/products", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("✅ Product Added Successfully!");
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="p-2 rounded bg-gray-800" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="p-2 rounded bg-gray-800" />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} className="p-2 rounded bg-gray-800" />
        <input type="text" name="category" placeholder="Category" onChange={handleChange} className="p-2 rounded bg-gray-800" />
        <input type="file" name="image" onChange={handleImage} className="p-2 rounded bg-gray-800" />
        <button type="submit" className="bg-red-600 py-2 px-4 rounded hover:bg-red-700 transition">
          Add Product
        </button>
      </form>
    </div>
  
  );
}
 
