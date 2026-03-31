export type UserRole = "student" | "instructor" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  cohort: string;
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl: string;
  completed: boolean;
  summary?: string;
}

export type QuizQuestionType = "mcq" | "true-false";

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOption: number;
  type?: QuizQuestionType;
  explanation?: string;
}

export interface ModuleQuiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface ReadingMaterial {
  id: string;
  title: string;
  type: "article" | "pdf" | "guide";
  url: string;
  estimatedMinutes: number;
}

export interface CourseModule {
  id: string;
  title: string;
  overview: string;
  lessons: Lesson[];
  readings: ReadingMaterial[];
  quizzes: ModuleQuiz[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submitted: boolean;
  score?: number;
}

export interface Course {
  id: string;
  title: string;
  track: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  instructor: string;
  description: string;
  durationHours?: number;
  learners?: number;
  rating?: number;
  skills?: string[];
  featured?: boolean;
  lessons: Lesson[];
  assignments: Assignment[];
  quiz: QuizQuestion[];
  modules: CourseModule[];
}

export interface Enrollment {
  userId: string;
  courseId: string;
  progress: number;
  streakDays: number;
}

export interface PlatformMetrics {
  activeLearners: number;
  completionRate: number;
  averageQuizScore: number;
  assignmentSubmissionRate: number;
}

export interface StudentQuizResult {
  courseId: string;
  moduleId: string;
  quizId: string;
  score: number;
  attemptedAt: string;
}
