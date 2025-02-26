import {
  LessonDetailDataResponse,
  Module,
  Sublesson,
  SubLessonDetailResponse,
} from '../saga/type';
export type HomeInitialState = {
  lessonDetail: LessonDetailData;
  subLessonDetail: SubLessonDetailData;
  selectedSubLessonStart?: SelectedSubLessonPayload;
  selectedModule?: Module;
};

export type SelectedSubLessonPayload = {
  moduleId: string;
  subLesson: Sublesson;
};

type LessonDetailData = Partial<LessonDetailDataResponse>;
export type SubLessonDetailData = Partial<SubLessonDetailResponse>;
