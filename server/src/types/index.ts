export interface User {
  id: number;
  email: string;
  name?: string;
  created_at?: string;
}

export interface Question {
  id: number;
  question_text: string;
  options: string[]; 
  correct_index: number; 
  created_by?: number | null;
}
