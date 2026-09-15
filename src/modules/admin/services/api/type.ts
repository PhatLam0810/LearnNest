import { Library } from '~mdDashboard/types/lesson';
import { Sublesson } from '~mdDashboard/redux/saga/type';
export interface CreateLessonParams {
  title: string;
  description: string;
  thumbnail: string;
  learnedSkills: string[];
  categories: string[];
  modules: string[];
  durations: number;
}

export interface CreateLibraryParams {
  title: string;
  description: string;
  type: string;
  url: string;
  tags: string[];
}

export interface UpdateLibraryParams {
  _id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  tags: string[];
}

export interface UpdateLessonParams {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  categories: string[];
  modules: string[];
  learnedSkills: string[];
  totalLibraries: number;
  totalDuration: number;
}

export interface UpdateSubLessonParams {
  _id: string;
  title: string;
  description: string;
  duration: number;
  libraries: string[];
}

export interface UpdateModuleParams {
  _id: string;
  title: string;
  durations: number;
  description: string;
  createdAt: string;
  hasSubLesson: boolean;
  updatedAt: string;
  subLessons?: Sublesson[];
  libraries?: Library[];
  __v: number;
}

export interface CreateModuleParams {
  lessonId: string;
  modules: { title: string; description: string }[];
}

export interface CreateFeedbackParams {
  fullName: string;
  email: string;
  content: string;
  images: string[];
  category?: 'content' | 'bug' | 'suggestion' | 'grading' | 'other';
}

export interface CreateSubModuleParams {
  moduleId: string;
  subLessons: {
    title: string;
    content?: string;
    videoUrl: string;
    pdfUrl: string;
    imageUrl: string;
    type: 0 | 1 | 2 | 3;
  }[];
}

export type QuestionUser = {
  _id?: string;
  fullName?: string;
  email?: string;
  avatar?: string;
};

export interface QuestionItem {
  _id: string;
  postId: string;
  type: string;
  commentText: string;
  user?: QuestionUser;
  createdAt: string;
  link?: string;
  contextTitle?: string;
  isAnswered?: boolean;
  dismissedAt?: string | null;
}

export interface QuestionStats {
  openCount: number;
  overdueCount: number;
  avgResponseHours: number | null;
}

export interface AnswerInfo {
  fullName?: string;
  commentText: string;
  createdAt: string;
}

export interface ReplyQuestionParams {
  postId: string;
  type: string;
  commentText: string;
  parentCommentId: string;
}
