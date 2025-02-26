export interface UpdateModule {
  id: string;
  title: string;
  description: string;
  durations: number;
  subLessonsData: string[];
}

export interface UpdateModuleFormData {
  id: string;
  title: string;
  description: string;
  subLessons: string[];
  duration: number;
}
