export interface Lesson {
  id: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  created_at: string;
}

export interface TypingSession {
  id: string;
  user_id: string;
  lesson_id: string;
  wpm: number;
  accuracy: number;
  time_taken: number;
  completed: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}
