import api from '@services/api';

export const getLessonDetailApi = (params: { id: string }) =>
  api.get(`/lesson/${params.id}`);

export const getSubLessonDetailApi = (params: { id: string }) =>
  api.get(`/lesson/sublessons/${params.id}`);
