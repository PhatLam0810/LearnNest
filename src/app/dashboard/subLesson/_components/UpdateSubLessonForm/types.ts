import { Library } from '~mdDashboard/types';

export interface UpdateSubLesson {
  id: string;
  title: string;
  description: string;
  durations: number;
  librariesData: Library[];
}

export interface UpdateLibraryFormData {
  title: string;
  description: string;
  url: string;
  type: string;
  tag: string[];
}
