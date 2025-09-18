import {create }from 'zustand';
import type {  QuizState } from '../types/types';


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
