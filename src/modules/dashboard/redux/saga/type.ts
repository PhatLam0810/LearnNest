import { Library } from '~mdDashboard/types';

export interface Lesson {
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
  isPremium: boolean;
  price: number;
}
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
  isPremium: boolean;
  price: number;
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
  durations: number;
  description: string;
  createdAt: string;
  hasSubLesson: boolean;
  updatedAt: string;
  subLessons?: Sublesson[];
  libraries?: Library[];
  __v: number;
}

export interface Sublesson {
  _id: string;
  title: string;
  description: string;
  note?: string;
  libraries: Library[];
  durations: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  isPremium: boolean;
  price: number;
}

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubLessonDetailResponse {
  _id: string;
  title: string;
  content: string;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LibraryType {
  _id: string;
  name: string;
  filter?: {
    collection: string;
    query: any;
  };
}
