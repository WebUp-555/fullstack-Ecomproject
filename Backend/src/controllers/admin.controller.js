import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Product } from "../models/products.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
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
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const file = req.file;

    console.log("Body:", req.body);
    console.log("File:", file);

    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // 🔹 Convert category name → ObjectId if needed
    let categoryId = category;
    if (!mongoose.Types.ObjectId.isValid(category)) {
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res.status(400).json({ message: "Invalid category name" });
      }
      categoryId = foundCategory._id;
    }

    // 🔹 Upload image to Cloudinary
    const imageUpload = await uploadOnCloudinary(file.path);
    if (!imageUpload || !imageUpload.url) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    // 🔹 Save to DB
    const product = await Product.create({
      name,
      description,
      price,
      category: categoryId,
      productImage: imageUpload.url,
    });

    return res.status(201).json({
      success: true,
      message: "✅ Product added successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error: error.message });
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

    // 🔹 Extract Cloudinary public_id from URL
    const imageUrl = product.productImage;
    const publicId = imageUrl.split("/").pop().split(".")[0];

    // 🔹 Delete image from Cloudinary
    await deleteFromCloudinary(publicId);

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
