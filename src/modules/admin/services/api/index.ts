import api from '@services/api';
import { QuestionStats, ReplyQuestionParams } from './type';

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
