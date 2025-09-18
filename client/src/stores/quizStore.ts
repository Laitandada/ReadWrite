import {create }from 'zustand';
import type { Question } from '../types/types';

interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number | null>;
  setQuestions: (q: Question[]) => void;
  selectAnswer: (questionId: number, selectedIndex: number) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  currentIndex: 0,
  answers: {},
  setQuestions: (q) =>
    set({
      questions: q,
      answers: q.reduce((acc: any, ques: any) => ((acc[ques.id] = null), acc), {})
    }),
  selectAnswer: (questionId, selectedIndex) => set((state) => ({ answers: { ...state.answers, [questionId]: selectedIndex } })),
  next: () => set((s) => ({ currentIndex: Math.min(s.currentIndex + 1, s.questions.length - 1) })),
  prev: () => set((s) => ({ currentIndex: Math.max(s.currentIndex - 1, 0) })),
  reset: () => set({ questions: [], currentIndex: 0, answers: {} })
}));
