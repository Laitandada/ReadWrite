import type { Request, Response } from "express";
import db from "../db/index.js";
import type { AuthRequest } from "../middlewares/authMiddleware.ts";

export async function getAllQuestions(req: Request, res: Response) {
  try {
    const { rows } = await db.query(
      "SELECT id, question_text, options, correct_index, created_by FROM questions ORDER BY id"
    );
    res.json(rows);
  } catch (err: any) {
    console.error("DB error in getAllQuestions:", err.message);
    res.status(500).json({
      message: "Unable to fetch questions. Please try again later.",
    });
  }
}

export async function createQuestion(req: AuthRequest, res: Response) {
  const { question_text, options, correct_index } = req.body;

  if (
    !question_text ||
    !Array.isArray(options) ||
    options.length !== 4 ||
    typeof correct_index !== "number" ||
    correct_index < 0 ||
    correct_index > 3
  ) {
    return res.status(400).json({
      message:
        "Invalid payload. Provide question_text, 4 options, and a valid correct_index (0–3).",
    });
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO questions (question_text, options, correct_index, created_by) 
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [question_text, JSON.stringify(options), correct_index, req.user?.id || null]
    );
    res.status(201).json({ id: rows[0].id });
  } catch (err: any) {
    console.error("DB error in createQuestion:", err.message);
    res.status(500).json({
      message: "Failed to create question. Please try again later.",
    });
  }
}

export async function updateQuestion(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { question_text, options, correct_index } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid question ID." });
  }

  try {
    const result = await db.query(
      `UPDATE questions 
       SET question_text=$1, options=$2, correct_index=$3 
       WHERE id=$4 
       RETURNING id`,
      [question_text, JSON.stringify(options), correct_index, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.json({ message: "Question updated successfully." });
  } catch (err: any) {
    console.error("DB error in updateQuestion:", err.message);
    res.status(500).json({
      message: "Failed to update question. Please try again later.",
    });
  }
}

export async function deleteQuestion(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid question ID." });
  }

  try {
    const result = await db.query("DELETE FROM questions WHERE id=$1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.json({ message: "Question deleted successfully." });
  } catch (err: any) {
    console.error("DB error in deleteQuestion:", err.message);
    res.status(500).json({
      message: "Failed to delete question. Please try again later.",
    });
  }
}
