export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Module {
  id: string;
  title: string;
  content: string; // Markdown or text
  quiz?: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  modules: Module[];
  thumbnailUrl: string;
  category: string;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  progress: number; // 0 to 100
  completedModuleIds: string[];
}