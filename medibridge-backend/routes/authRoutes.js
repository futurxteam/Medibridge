// routes/authRoutes.js
import { Router } from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);

export default router;