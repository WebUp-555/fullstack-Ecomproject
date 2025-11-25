import e, { Router } from "express";
import { register, login, logout, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails,forgotPassword } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router=Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").put(verifyJWT,updateAccountDetails)
router.route("/forgot-password").post(forgotPassword)
export default router