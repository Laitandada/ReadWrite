import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import questionsRoutes from './routes/questions.js';
import quizRoutes from './routes/quiz.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/quiz', quizRoutes);

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

export default app;
