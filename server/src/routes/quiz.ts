import { Router } from "express";
import { startQuiz, submitQuiz } from "../controllers/quizController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// @route   GET /api/quiz/start
// @desc    Start quiz (fetch questions without correct answers)
// @access  Private
router.get("/start", authenticateJWT, startQuiz);

// @route   POST /api/quiz/submit
// @desc    Submit quiz answers and get results
// @access  Private
router.post("/submit", authenticateJWT, submitQuiz);

export default router;
