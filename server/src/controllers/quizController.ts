import type { Request, Response } from 'express';
import db from '../db/index.js';
import type { AuthRequest } from '../middlewares/authMiddleware.ts';

export async function startQuiz(req: AuthRequest, res: Response) {
  try {
    const { rows } = await db.query('SELECT id, question_text, options FROM questions ORDER BY id');
    res.json({ questions: rows }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function submitQuiz(req: AuthRequest, res: Response) {
  
  try {
    const { answers, timeTakenSeconds } = req.body;
    if (!Array.isArray(answers)) return res.status(400).json({ message: 'Invalid answers' });

    // get correct answers
    const ids = answers.map((a: any) => a.questionId);
    const { rows } = await db.query('SELECT id, correct_index FROM questions WHERE id = ANY($1::int[])', [ids]);
    const correctMap: Record<number, number> = {};
    rows.forEach((r: any) => (correctMap[r.id] = r.correct_index));

    let correctCount = 0;
    answers.forEach((a: any) => {
      if (correctMap[a.questionId] === a.selectedIndex) correctCount++;
    });
    const total = ids.length;
    const score = Math.round((correctCount / total) * 100);

    res.json({ score, correctCount, total, timeTakenSeconds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
