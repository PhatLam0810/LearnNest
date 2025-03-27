export interface LessonRecommendRes {
  today: Today;
  recommend: Recommend[];
  popularCategories: PopularCategory[];
}
export interface SubscriptionsRes {
  status?: string;
  _id?: string;
  userId?: string;
  lessonId: string;
  planName?: string;
  startDate?: string;
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Today {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  learnedSkills: string[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Recommend {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  learnedSkills: string[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PopularCategory {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
