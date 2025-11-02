import express from "express";
import { verifyJWT, requireAdmin } from "../middlewares/auth.middleware.js";
import { adminLogin, adminLogout, getAllUsers, addProduct,addCategory} from "../controllers/admin.controller.js";

import multer from "multer";
import { upload as cloudinaryUpload } from "../middlewares/cloudinary.middleware.js";


const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", verifyJWT, requireAdmin, adminLogout);
router.get("/users", verifyJWT, requireAdmin, getAllUsers);
router.post(
  "/addproduct",
  verifyJWT,
  requireAdmin,
  upload.single("file"),
  addProduct
);


router.post("/add-category",verifyJWT, requireAdmin, addCategory);



export default router;
