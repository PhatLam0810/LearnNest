import api from '@services/api';
import {
  CreateFeedbackParams,
  CreateLessonParams,
  CreateLibraryParams,
  CreateModuleParams,
  QuestionStats,
  ReplyQuestionParams,
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

export const createFeedbackApi = (params: CreateFeedbackParams) =>
  api.post(`/feedback`, params);

export const getQuestionStatsApi = () =>
  api
    .get('/comments/admin/questions/stats')
    .then(res => (res.data?.data ?? res.data) as QuestionStats);

export const getQuestionAnswerApi = (postId: string, questionId: string) =>
  api.post('/comments/getList', { postId, pageSize: 50 }).then(res => {
    const items = res.data?.data?.items || res.data?.items || [];
    return items
      .filter((c: any) => c.parentCommentId === questionId)
      .sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )[0];
  });

export const replyQuestionApi = (params: ReplyQuestionParams) =>
  api.post('/comments', params);

export const dismissQuestionApi = (id: string) =>
  api.post(`/comments/admin/questions/${id}/dismiss`);

export const reopenQuestionApi = (id: string) =>
  api.post(`/comments/admin/questions/${id}/reopen`);
