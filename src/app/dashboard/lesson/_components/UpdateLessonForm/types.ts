export interface UpdateLesson {
  title: string;
  _id: string;
  description: string;
  thumbnail: string;
  categories: string[];
  modules: string[];
  learnedSkills: string[];
}

export interface UpdateLessonFormData {
  _id: string;
  lessonName: string;
  description: string;
  thumbnail: string;
  categories: string[];
  skills: string[];
}
