import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Product } from "../models/products.model.js";
import { Category } from "../models/category.model.js";
import {Cart} from "../models/addToCart.model.js";

import mongoose from "mongoose";

const ADMIN_ROLE = "admin";

// 🧑‍💼 Admin Login
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const adminUser = await User.findOne({ email, role: ADMIN_ROLE });
  if (!adminUser) {
    throw new ApiError(401, "Admin not found or not an admin");
  }

  const isPasswordValid = await adminUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { _id: adminUser._id, email: adminUser.email, role: adminUser.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1h" }
  );

  // Optionally set token as a cookie
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600000, // 1 hour
  });

  res.status(200).json({
    success: true,
    token,
    message: "Admin logged in successfully",
  });
});

// 👥 Get All Users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res.status(200).json({
    success: true,
    users,
    message: "All users fetched successfully",
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json({
    success: true,
    user,
    message: "User fetched successfully",
  });
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
  

export const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json({
    success: true,
    message: "Category added successfully",
    category,
  });
});

// ✅ Add product (supports category name or ObjectId)
export const addProduct = asyncHandler(async (req, res) => {
  let { name, description, category, price, stock } = req.body;

  if (category && !mongoose.isValidObjectId(category)) {
    const catDoc = await Category.findOne({ name: category }).lean();
    if (!catDoc) {
      throw new ApiError(400, 'Invalid category name');
    }
    category = catDoc._id;
  }

  let image = null;
  if (req.file?.secure_url) {
    image = req.file.secure_url;
  } else if (req.file?.filename) {
    image = `/uploads/${req.file.filename}`;
  }

  const product = await Product.create({
    name,
    description,
    category,
    price: price ? Number(price) : undefined,
    stock: stock ? Number(stock) : undefined,
    image
  });

  res.status(201).json({ success: true, product });
});

// ✅ Delete product (removes from DB + Cloudinary)
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const imageUrl = product.image || product.productImage;
  if (imageUrl && /res\.cloudinary\.com/i.test(imageUrl)) {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    try { await deleteFromCloudinary(publicId); } catch (_) { /* ignore */ }
  }

  await Product.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "🗑️ Product deleted successfully" });
});

// 🚪 Admin Logout
export const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ success: true, message: "Admin logged out successfully" });
});

// List all products (public)
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category", "name slug")
    .lean();
  res.json({ success: true, products });
});

// Single product (public)
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name slug")
    .lean();
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.json({ success: true, product });
});

// List categories (public)
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().lean();
  res.json({ success: true, categories });
});

export const updateProduct = asyncHandler(async (req, res) => {  
  const { id } = req.params;
  let { name, description, category, price, stock } = req.body;
  const updateData = {};

  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (price) updateData.price = Number(price);
  if (stock) updateData.stock = Number(stock);
  if (category) {
    if (!mongoose.isValidObjectId(category)) {
      const catDoc = await Category.findOne({ name: category }).lean();
      if (!catDoc) {
        throw new ApiError(400, 'Invalid category name');
      }
      updateData.category = catDoc._id;
    } else {
      updateData.category = category;
    }
  }
  if (req.file?.secure_url) {
    updateData.image = req.file.secure_url;
  } else if (req.file?.filename) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true })
    .populate("category", "name slug")
    .lean();

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
  }

  res.json({ success: true, product: updatedProduct });
});


export const addToCart = asyncHandler(async (req, res) => {
  // Adds a product to the authenticated user's cart.
  // - Validates input and stock
  // - Creates cart if missing, else merges quantity
  const userId = req.user?._id;
  let { productId, quantity } = req.body;

  quantity = Number(quantity) || 0;
  if (!productId || quantity < 1) {
    throw new ApiError(400, "Product ID and valid quantity are required");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.stock < quantity) {
    throw new ApiError(400, "Insufficient stock available");
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [{ product: productId, quantity }] });
  } else {
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
  }

  await cart.save();
  res.status(200).json({ success: true, message: "Product added to cart successfully", cart });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  // Removes a specific product from the authenticated user's cart.
  // - Requires productId
  // - No-op if item not present; persists updated cart
  const userId = req.user?._id;
  const { productId } = req.body;
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();
  res.status(200).json({ success: true, message: "Product removed from cart successfully", cart });
});

export const getCart = asyncHandler(async (req, res) => {
  // Returns the authenticated user's cart with populated products
  // and a computed total amount (price * quantity).
  const userId = req.user?._id;
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  const totalAmount = cart.items.reduce((sum, item) => {
    const price = Number(item.product?.price) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);
  res.status(200).json({ success: true, cart, totalAmount });
});

