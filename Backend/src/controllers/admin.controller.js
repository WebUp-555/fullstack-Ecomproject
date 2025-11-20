import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Product } from "../models/products.model.js";
import { Category } from "../models/category.model.js";
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
  

export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Error adding category", error: error.message });
  }
};

// ✅ Add product (supports category name or ObjectId)
export const addProduct = async (req, res, next) => {
  try {
    let { name, description, category, price, stock } = req.body;

    // Resolve category if it's a name instead of an ObjectId
    if (category && !mongoose.isValidObjectId(category)) {
      const catDoc = await Category.findOne({ name: category }).lean();
      if (!catDoc) {
        return res.status(400).json({ success: false, message: 'Invalid category name' });
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

    return res.status(201).json({ success: true, product });
  } catch (e) {
    console.error('addProduct error:', e);
    next(e);
  }
};

// ✅ Delete product (removes from DB + Cloudinary)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If stored via Cloudinary secure_url in image or productImage field
    const imageUrl = product.image || product.productImage;
    if (imageUrl && /res\.cloudinary\.com/i.test(imageUrl)) {
      // Attempt delete only for cloudinary hosted assets
      const publicId = imageUrl.split("/").pop().split(".")[0];
      try { await deleteFromCloudinary(publicId); } catch (_) { /* ignore */ }
    }

    // 🔹 Delete product from DB
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "🗑️ Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// 🚪 Admin Logout
export const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ success: true, message: "Admin logged out successfully" });
});

// List all products (public)
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("category", "name slug")
      .lean();
    return res.json({ success: true, products });
  } catch (e) { next(e); }
};

// Single product (public)
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .lean();
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, product });
  } catch (e) { next(e); }
};

// List categories (public)
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().lean();
    return res.json({ success: true, categories });
  } catch (e) { next(e); }
};
