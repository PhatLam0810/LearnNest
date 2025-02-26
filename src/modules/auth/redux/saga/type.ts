export interface LessonDetailDataResponse {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  learnedSkills: string[];
  categories: Category[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  modules: Module[];
  relatedLessons: RelatedLesson[];
}

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Module {
  _id: string;
  title: string;
  duration: number;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
  subLessons: Sublesson[];
  __v: number;
}

export interface Sublesson {
  _id: string;
  title: string;
  content?: string;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  videoUrl?: string;
  pdfUrl?: string;
}

export interface RelatedLesson {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  learnedSkills: string[];
  categories: Category[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
