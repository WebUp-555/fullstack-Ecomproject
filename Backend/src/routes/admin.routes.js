import express from "express";
import { verifyJWT, requireAdmin } from "../middlewares/auth.middleware.js";
import { adminLogin, adminLogout, getAllUsers, getUserById, addProduct, addCategory, deleteProduct, deleteUserById, getAllCategories, getProductById, getAllProducts,  updateProduct } from "../controllers/admin.controller.js";

import multer from "multer";
import { upload as cloudinaryUpload } from "../middlewares/cloudinary.middleware.js";


const upload = multer({ dest: "uploads/" });

const router = express.Router();

// ============ AUTH ROUTES ============
router.post("/login", adminLogin);
router.post("/logout", verifyJWT, requireAdmin, adminLogout);

// ============ USER MANAGEMENT ROUTES ============
router.get("/users", verifyJWT, requireAdmin, getAllUsers);
router.get("/users/:id", verifyJWT, requireAdmin, getUserById);
router.delete("/users/:id", verifyJWT, requireAdmin, deleteUserById);

// ============ PRODUCT ROUTES ============
router.post("/addproduct", verifyJWT, requireAdmin, upload.single("image"), addProduct);
router.put("/updateproduct/:id", verifyJWT, requireAdmin, upload.single("image"), updateProduct);
router.delete("/deleteproduct/:id", verifyJWT, requireAdmin, deleteProduct);

// ============ CATEGORY ROUTES ============
router.post("/addcategory", verifyJWT, requireAdmin, addCategory);

export default router;
