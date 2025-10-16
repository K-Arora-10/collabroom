import express from "express";
import { registerUser, verifyEmail} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify/:token", verifyEmail);  

export default router;