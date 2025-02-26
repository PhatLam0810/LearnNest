import api from '@services/api';
import {
  CreateLessonParams,
  CreateLibraryParams,
  CreateModuleParams,
  CreateSubModuleParams,
  UpdateLessonParams,
  UpdateLibraryParams,
  UpdateModuleParams,
  UpdateSubLessonParams,
} from './type';

export const createLessonApi = (params: CreateLessonParams) =>
  api.post(`/lesson`, params);

export const createModuleApi = (params: CreateModuleParams) =>
  api.post(`/lesson/addModule/${params.lessonId}`, params.modules);

export const createSubModuleApi = (params: CreateSubModuleParams) =>
  api.post(`/lesson/addSubLesson/${params.moduleId}`, params.subLessons);

export const createLibraryApi = (params: CreateLibraryParams) =>
  api.post(`/library`, params);

export const updateLibraryApi = (params: UpdateLibraryParams) =>
  api.put(`/library`, params);

export const updateLessonApi = (params: UpdateLessonParams) =>
  api.put(`/lesson`, params);

export const updateSubLessonApi = (params: UpdateSubLessonParams) =>
  api.put(`/lesson/updateSubLesson`, params);

export const updateModuleApi = (params: UpdateModuleParams) =>
  api.put(`/lesson/updateModule`, params);
