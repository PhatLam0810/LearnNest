export interface LessonRecommendRes {
  today: Today;
  recommend: Recommend[];
  popularCategories: Category[];
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
  isPremium: boolean;
  price: number;
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
  isPremium: boolean;
  price: number;
  __v: number;
}

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LibraryType {
  _id: string;
  name: string;
  filter?: {
    collection: string;
    query?: any;
  };
  __v: number;
}
