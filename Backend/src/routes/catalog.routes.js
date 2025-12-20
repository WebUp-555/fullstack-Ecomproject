import { Router } from "express";
import { getAllProducts, getProductById, getAllCategories, addToCart, removeFromCart, getCart, getActiveBanners } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/products", verifyJWT, getAllProducts);
router.get("/products/:id", verifyJWT, getProductById);
router.get("/categories", verifyJWT, getAllCategories);
router.get("/banners", getActiveBanners);
router.post("/cart/add", verifyJWT, addToCart);
router.post("/cart/remove", verifyJWT, removeFromCart);
router.get("/cart", verifyJWT, getCart);


export default router;