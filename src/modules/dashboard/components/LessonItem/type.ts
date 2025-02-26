export interface RecommendData {
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
