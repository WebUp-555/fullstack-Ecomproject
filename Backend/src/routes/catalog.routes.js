import { Router } from "express";
import { getAllProducts, getProductById, getAllCategories,addToCart,removeFromCart,getCart } from "../controllers/admin.controller.js";

const router = Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/categories", getAllCategories);
router.post("/cart/add", addToCart);
router.post("/cart/remove", removeFromCart);
router.get("/cart", getCart);


export default router;