import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
router.post("/login", login);

export default router;
