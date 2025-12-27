export interface CreateLessonFrom {
  title: string;
  description: string;
  categories: any[];
  thumbnail: string;
  learnedSkills: any[];
  price?: number;
}
export interface CreateModuleFrom {
  items: { title: string; description: string }[];
}
export interface CreateSubModuleFrom {
  subModuleName: string;
  subModuleDescription: string;
}
