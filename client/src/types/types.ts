export interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_index?: number;
}

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "success" | "danger" | "outline";
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
};
export interface AuthState {
  token: string | null;
  user: { id: number; email: string; name: string } | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number | null>;
  setQuestions: (q: Question[]) => void;
  selectAnswer: (questionId: number, selectedIndex: number) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}