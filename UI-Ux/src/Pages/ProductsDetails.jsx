import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../Api/catalogApi";

// Build a stable origin (strip trailing /api/v1 if present)
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "");

function buildImageUrl(product) {
  if (!product) return null;
  // Prefer single image field; fallback to first in images[] if it's a plain string
  let raw = product.image;
  if (!raw && Array.isArray(product.images) && typeof product.images[0] === "string") {
    raw = product.images[0];
  }
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw; // Already absolute (e.g. Cloudinary)
  // Normalize leading slash
  const clean = raw.startsWith("/") ? raw.slice(1) : raw;
  try {
    return new URL(clean, ORIGIN + "/").toString();
  } catch (_) {
    return ORIGIN + "/" + clean; // Fallback
  }
}

export default function ProductsDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await getProductById(id);
        if (!p) {
          setNotFound(true);
        }
        setProduct(p);
      } catch (e) {
        // Distinguish 404
        if (e.status === 404) setNotFound(true);
        setError(e?.response?.data?.message || e.message);
      }
    })();
  }, [id]);

  const imageUrl = useMemo(() => buildImageUrl(product), [product]);

  if (error && !notFound) return <div className="p-6 text-red-500">{error}</div>;
  if (notFound) return <div className="p-6 text-white">Product not found.</div>;
  if (!product) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Image Section with Glow */}
          <div className="bg-zinc-800 rounded-2xl p-6 shadow-[0_0_30px_rgba(234,21,56,0.3)] hover:shadow-[0_0_40px_rgba(234,21,56,0.5)] transition-all duration-500 hover:scale-[1.02]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name || "Product image"}
                loading="lazy"
                className="w-full h-auto max-h-[500px] object-contain rounded-xl bg-zinc-900"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center rounded-xl bg-zinc-900 text-gray-400 text-sm">
                No image available
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="text-white space-y-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {product.name}
              </h1>
              {product.category && (
                <p className="text-red-400 text-sm mt-2 font-semibold tracking-wide">
                  {product.category.name || product.category}
                </p>
              )}
            </div>

            {product.price && (
              <div className="bg-zinc-800 rounded-xl p-4 inline-block shadow-lg">
                <p className="text-3xl font-bold text-red-400">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            )}

            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
              <h2 className="text-xl font-semibold mb-3 text-red-400">Description</h2>
              <p className="text-gray-300 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </div>

            {product.stock !== undefined && (
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.stock > 0 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>
            )}

            <button className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(234,21,56,0.6)] hover:scale-105 transition-all duration-300">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}