import { Router } from "express";
import { getAllQuestions, createQuestion, updateQuestion, deleteQuestion } from "../controllers/questionsController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// @route   GET /api/questions
// @desc    Get all questions (protected)
// @access  Private
router.get("/", authenticateJWT, getAllQuestions);

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private
router.post("/", authenticateJWT, createQuestion);

// @route   PUT /api/questions/:id
// @desc    Update question
// @access  Private
router.put("/:id", authenticateJWT, updateQuestion);

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Private
router.delete("/:id", authenticateJWT, deleteQuestion);

export default router;
