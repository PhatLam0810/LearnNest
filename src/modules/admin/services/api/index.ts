import api from '@services/api';
import {
  CreateLessonParams,
  CreateLibraryParams,
  CreateModuleParams,
  UpdateLessonParams,
  UpdateLibraryParams,
  UpdateModuleParams,
} from './type';

export const createLessonApi = (params: CreateLessonParams) =>
  api.post(`/lesson`, params);

export const createModuleApi = (params: CreateModuleParams) =>
  api.post(`/lesson/addModule/${params.lessonId}`, params.modules);

export const createLibraryApi = (params: CreateLibraryParams) =>
  api.post(`/library`, params);

export const updateLibraryApi = (params: UpdateLibraryParams) =>
  api.put(`/library`, params);

export const updateLessonApi = (params: UpdateLessonParams) =>
  api.put(`/lesson`, params);

export const updateModuleApi = (params: UpdateModuleParams) =>
  api.put(`/lesson/updateModule`, params);
