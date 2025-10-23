import express from "express";
import { loginUser, logoutUser, registerUser, verifyEmail, refreshToken, protectedRoute} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyEmail);  
router.post("/login",loginUser);
router.get("/refresh", refreshToken);
router.post("/logout",verifyToken,logoutUser);
router.get("/protected",verifyToken,protectedRoute);


export default router;
