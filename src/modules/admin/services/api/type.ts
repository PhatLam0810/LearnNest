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
  description: string;
  duration: number;
  subLessons: string[];
}

export interface CreateModuleParams {
  lessonId: string;
  modules: { title: string; description: string }[];
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
