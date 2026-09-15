import { Library } from '~mdDashboard/types';
import { Module, Sublesson } from '../saga/type';
export type HomeInitialState = {
  selectedSubLessonStart?: SelectedSubLessonPayload;
  selectedModule?: Module;
  selectedLibrary?: Library;
  videoStatus: boolean;
};

export type SelectedSubLessonPayload = {
  moduleId: string;
  subLesson: Sublesson;
};
