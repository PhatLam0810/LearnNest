import { baseQuery } from '@redux/RTKQuery';
import { AxiosResponse } from 'axios';
import { LibraryType } from '~mdDashboard/redux/RTKQuery/types';
import { Category } from '~mdDashboard/redux/saga/type';
import {
  CreateUserParams,
  DeleteAdminRoleParams,
  ImportUserItem,
  ImportUserPreviewRequest,
  ImportUsersRequest,
  ImportUsersResponse,
  CreatePracticeClassPayload,
  CreatePracticeClassResponse,
  CreatePracticeTaskPayload,
  GenerateCriteriaParams,
  GeneratedCriterion,
  LessonContentOverviewModule,
  LessonLearnerPoolResponse,
  LessonLearnersResponse,
  LessonLearnersSummaryResponse,
  PracticeCriteriaInput,
  PracticeClassListResponse,
  PracticeClassUsersResponse,
  ReminderLogItem,
  ReminderLogType,
  RemindLearnersBulkResponse,
  SendImportEmailsRequest,
  SendImportEmailsResponse,
  SetPracticeCriteriaParams,
  SetRoleParams,
  UpdatePracticeTaskParams,
} from './type';
import {
  PracticeCriteria,
  PracticeInstructionItem,
  PracticeSubmission,
  PracticeTask,
  PracticeTaskDetail,
} from '~mdDashboard/types/practice';

// Id tag ReminderLog phải khớp CHÍNH XÁC giữa providesTags (getReminderLogs)
// và invalidatesTags (4 mutation nhắc nhở) — targetId rỗng dùng cho loại
// 'inactivity' (nhắc chung cả khóa, không gắn 1 nội dung cụ thể nào).
const reminderLogTagId = (
  lessonId: string,
  type: ReminderLogType,
  targetId?: string,
) => `${lessonId}:${type}:${targetId ?? 'none'}`;

export const adminQuery = baseQuery.injectEndpoints({
  endpoints: builder => ({
    getCategoriesAll: builder.query<Category[], void>({
      query: () => '/lesson/categories/getAll',
      transformResponse: (res: AxiosResponse<Category[]>) => res.data,
    }),

    getAnalyticsSummary: builder.query<
      { label: string; count: number }[],
      { groupBy: 'day' | 'week' | 'month' | 'year'; limit?: number }
    >({
      query: params => ({
        url: '/analytics/summary',
        method: 'GET',
        params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    getLibraryById: builder.query<any, string>({
      query: (id: string) => ({
        url: `library/${id}`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    addLibrary: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'library',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    addModule: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'lesson/addModule',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    addLesson: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'lesson',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    updateLesson: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'lesson',
        method: 'PUT',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    deleteLibrary: builder.mutation({
      query: (params: { _id: string }) => ({
        url: 'library',
        method: 'DELETE',
        body: params,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    deleteModule: builder.mutation({
      query: (params: { _id: string }) => ({
        url: `/lesson/module/${params._id}`,
        method: 'DELETE',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    deleteLesson: builder.mutation({
      query: (params: { _id: string }) => ({
        url: `/lesson/${params._id}`,
        method: 'DELETE',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    bulkLibraryFromYoutube: builder.mutation<any, void>({
      query: (body: any) => ({
        url: '/lesson/bulkLibraryFromYoutube',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    bulkLibraryFromGoogleDrive: builder.mutation<any, void>({
      query: (body: any) => ({
        url: '/library/bulkFromGoogleDrive',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getListLibraryType: builder.query<LibraryType[], void>({
      query: (params: any) => ({
        url: 'lesson/library/getListLibraryType',
        method: 'GET',
        params,
      }),
      transformResponse: (res: AxiosResponse<LibraryType[]>) => {
        const data = res.data;
        data.shift();
        return data;
      },
    }),
    addLibraryType: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'lesson/library/addLibraryType',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    getListTagFirstPage: builder.query<any, void>({
      query: (body: any) => ({
        url: 'tag/getAll',
        method: 'POST',
        body: { search: body.search },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    addNewTag: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'tag',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    getUserInfoById: builder.mutation({
      query: (params: { _id: string }) => ({
        url: `user/getUserInfoById/${params._id}`,
        method: 'GET',
      }),
      transformResponse: (res: any) => res.data,
    }),

    setAdminRole: builder.mutation({
      query: (params: SetRoleParams) => ({
        url: `user/setAdminRole/`,
        method: 'POST',
        body: params,
      }),
      transformResponse: (res: any) => res.data,
    }),
    deleteAdminRole: builder.mutation({
      query: (params: DeleteAdminRoleParams) => ({
        url: `user/removeAdminRole/`,
        method: 'PUT',
        body: params,
      }),
      transformResponse: (res: any) => res.data,
    }),
    createUser: builder.mutation({
      query: (params: CreateUserParams) => ({
        url: `admin/createUser/`,
        method: 'POST',
        body: params,
      }),
      transformResponse: (res: any) => res.data,
    }),
    previewImportUsers: builder.mutation<
      ImportUserItem[],
      ImportUserPreviewRequest
    >({
      query: body => ({
        url: 'admin/users/import/preview',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<ImportUserItem[]>) => res.data,
    }),
    importUsersBulk: builder.mutation<ImportUsersResponse, ImportUsersRequest>({
      query: body => ({
        url: 'admin/users/import/bulk',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<ImportUsersResponse>) => res.data,
    }),
    sendImportEmails: builder.mutation<
      SendImportEmailsResponse,
      SendImportEmailsRequest
    >({
      query: body => ({
        url: 'admin/users/import/send-emails',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<SendImportEmailsResponse>) =>
        res.data,
    }),
    getLessonLearnersSummary: builder.query<
      LessonLearnersSummaryResponse,
      void
    >({
      query: () => ({
        url: 'admin/lessons/learners/summary',
        method: 'GET',
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    getLessonContentOverview: builder.query<
      LessonContentOverviewModule[],
      string
    >({
      query: lessonId => ({
        url: `admin/lessons/${lessonId}/content-overview`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getLessonLearners: builder.mutation<
      LessonLearnersResponse,
      { lessonId: string; body?: any }
    >({
      query: ({ lessonId, body }) => ({
        url: `admin/lessons/${lessonId}/learners`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    getLessonLearnersPool: builder.query<
      LessonLearnerPoolResponse,
      {
        lessonId: string;
        search?: string;
        class?: string;
        major?: string;
        faculty?: string;
        pageNum?: number;
        pageSize?: number;
      }
    >({
      query: ({ lessonId, ...params }) => ({
        url: `admin/lessons/${lessonId}/learners/pool`,
        method: 'GET',
        params,
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    createPracticeClass: builder.mutation<
      CreatePracticeClassResponse,
      { lessonId: string; body: CreatePracticeClassPayload }
    >({
      query: ({ lessonId, body }) => ({
        url: `admin/lessons/${lessonId}/practice-classes`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    getPracticeClasses: builder.query<
      PracticeClassListResponse,
      { lessonId: string; search?: string; pageNum?: number; pageSize?: number }
    >({
      query: ({ lessonId, ...params }) => ({
        url: `admin/practice-classes/${lessonId}`,
        method: 'GET',
        params,
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    getPracticeClassUsers: builder.query<
      PracticeClassUsersResponse,
      {
        classId: string;
        search?: string;
        class?: string;
        major?: string;
        faculty?: string;
        pageNum?: number;
        pageSize?: number;
      }
    >({
      query: ({ classId, ...params }) => ({
        url: `admin/practice-classes/${classId}/users`,
        method: 'GET',
        params,
      }),
      transformResponse: (res: any) => res?.data ?? res,
    }),
    exportLearners: builder.mutation<Blob, { learners: any[] }>({
      query: body => ({
        url: 'admin/export-learners',
        method: 'POST',
        body,
        responseHandler: response => response.blob(),
      }),
    }),
    remindLearner: builder.mutation<
      { message: string },
      { lessonId: string; userId: string }
    >({
      query: ({ lessonId, userId }) => ({
        url: `admin/lessons/${lessonId}/learners/${userId}/remind`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: 'ReminderLog', id: reminderLogTagId(lessonId, 'inactivity') },
      ],
    }),
    remindLearnersBulk: builder.mutation<
      RemindLearnersBulkResponse,
      { lessonId: string }
    >({
      query: ({ lessonId }) => ({
        url: `admin/lessons/${lessonId}/learners/remind-bulk`,
        method: 'POST',
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_result, _error, { lessonId }) => [
        { type: 'ReminderLog', id: reminderLogTagId(lessonId, 'inactivity') },
      ],
    }),
    // Nhắc riêng những học viên CHƯA XEM XONG đúng 1 video/bài học cụ thể —
    // khác remindLearnersBulk (nhắc theo "im lặng bao lâu" tính chung cả
    // khóa), dùng ngay trong modal "Người đã xem" của 1 video.
    remindNotWatchedVideo: builder.mutation<
      RemindLearnersBulkResponse,
      { lessonId: string; subLessonId: string }
    >({
      query: ({ lessonId, subLessonId }) => ({
        url: `admin/lessons/${lessonId}/videos/${subLessonId}/remind-not-watched`,
        method: 'POST',
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_result, _error, { lessonId, subLessonId }) => [
        {
          type: 'ReminderLog',
          id: reminderLogTagId(lessonId, 'video', subLessonId),
        },
      ],
    }),
    // Nhắc riêng những học viên CHƯA ĐẠT (>= 80%) 1 bài thực hành cụ thể —
    // đối xứng remindNotWatchedVideo nhưng cho bài thực hành.
    remindNotPassedTask: builder.mutation<
      RemindLearnersBulkResponse,
      { lessonId: string; taskId: string }
    >({
      query: ({ lessonId, taskId }) => ({
        url: `admin/lessons/${lessonId}/tasks/${taskId}/remind-not-passed`,
        method: 'POST',
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_result, _error, { lessonId, taskId }) => [
        { type: 'ReminderLog', id: reminderLogTagId(lessonId, 'task', taskId) },
      ],
    }),
    // Lịch sử các đợt nhắc gần đây — hiện ngay dưới từng nút nhắc tương ứng
    // để admin biết "đã nhắc chưa, lúc nào, bao nhiêu người" thay vì chỉ
    // thấy kết quả thoáng qua lúc bấm xong rồi mất.
    getReminderLogs: builder.query<
      ReminderLogItem[],
      { lessonId: string; type?: ReminderLogType; targetId?: string }
    >({
      query: ({ lessonId, type, targetId }) => ({
        url: `admin/lessons/${lessonId}/reminder-logs`,
        method: 'GET',
        params: { type, targetId },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data.items,
      providesTags: (_result, _error, { lessonId, type, targetId }) => [
        {
          type: 'ReminderLog',
          id: reminderLogTagId(lessonId, type ?? 'inactivity', targetId),
        },
      ],
    }),
    sendPracticeClassEmails: builder.mutation<
      { successful: number; failed: number; details: any[] },
      { classId: string }
    >({
      query: ({ classId }) => ({
        url: `admin/practice-classes/${classId}/send-email`,
        method: 'POST',
      }),
      transformResponse: (res: any) => res.data,
    }),

    // ---- MOS Practice Exam (soạn đề Word/Excel thực hành) ----
    getPracticeTasksAdmin: builder.query<
      PracticeTask[],
      { subject?: 'Word' | 'Excel'; lessonId?: string } | void
    >({
      query: params => ({
        url: 'practice/tasks/admin/all',
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: result =>
        result
          ? [
              ...result.map(t => ({
                type: 'PracticeTask' as const,
                id: t._id,
              })),
              { type: 'PracticeTask' as const, id: 'LIST' },
            ]
          : [{ type: 'PracticeTask' as const, id: 'LIST' }],
    }),
    getPracticeTaskDetailAdmin: builder.query<PracticeTaskDetail, string>({
      query: taskId => ({
        url: `practice/tasks/${taskId}`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_result, _error, taskId) => [
        { type: 'PracticeTask', id: taskId },
      ],
    }),
    createPracticeTask: builder.mutation<
      PracticeTask,
      CreatePracticeTaskPayload
    >({
      query: body => ({
        url: 'practice/tasks',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: [{ type: 'PracticeTask', id: 'LIST' }],
    }),
    updatePracticeTask: builder.mutation<
      PracticeTask,
      UpdatePracticeTaskParams
    >({
      query: ({ taskId, body }) => ({
        url: `practice/tasks/${taskId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'PracticeTask', id: taskId },
        { type: 'PracticeTask', id: 'LIST' },
      ],
    }),
    deletePracticeTask: builder.mutation<void, string>({
      query: taskId => ({
        url: `practice/tasks/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, taskId) => [
        { type: 'PracticeTask', id: taskId },
        { type: 'PracticeTask', id: 'LIST' },
      ],
    }),
    setPracticeCriteria: builder.mutation<
      PracticeCriteria[],
      SetPracticeCriteriaParams
    >({
      query: ({ taskId, criteria }) => ({
        url: `practice/tasks/${taskId}/criteria`,
        method: 'PUT',
        body: { criteria },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'PracticeTask', id: taskId },
      ],
    }),
    getPracticeInstructions: builder.query<PracticeInstructionItem[], string>({
      query: taskId => ({
        url: `practice/tasks/${taskId}/instructions`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    // Xem trước hướng dẫn từ tiêu chí ĐANG CÓ trên form (kể cả chưa lưu) —
    // khác getPracticeInstructions ở trên (luôn đọc DB, nên hiện hướng dẫn
    // CŨ/rỗng nếu vừa sửa tiêu chí mà chưa bấm "Lưu tiêu chí" — bug thật đã
    // gặp khiến nút xem trước trông như không hoạt động).
    previewInstructions: builder.mutation<
      PracticeInstructionItem[],
      PracticeCriteriaInput[]
    >({
      query: criteria => ({
        url: `practice/tasks/preview-instructions`,
        method: 'POST',
        body: { criteria },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getPracticeSubmissionsForTask: builder.query<PracticeSubmission[], string>({
      query: taskId => ({
        url: `practice/admin/tasks/${taskId}/submissions`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    setPracticeTaskModule: builder.mutation<
      PracticeTask,
      { taskId: string; moduleId: string | null; order?: number }
    >({
      query: ({ taskId, moduleId, order }) => ({
        url: `practice/tasks/${taskId}/module`,
        method: 'PUT',
        body: { moduleId, order },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      // Đổi module của 1 task ảnh hưởng cả moduleTitle hiển thị ở list lẫn
      // tag "Đang thuộc: ..." trong picker chọn bài thực hành ở module khác.
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: 'PracticeTask', id: taskId },
        { type: 'PracticeTask', id: 'LIST' },
      ],
    }),
    // Gợi ý tiêu chí chấm điểm bằng AI, đọc mô tả đề bài — chỉ là điểm khởi
    // đầu để admin xem/chỉnh trước khi bấm "Lưu tiêu chí" thật, không tự
    // lưu vào task.
    generateCriteria: builder.mutation<
      GeneratedCriterion[],
      GenerateCriteriaParams
    >({
      query: body => ({
        url: `practice/tasks/generate-criteria`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
  }),
  overrideExisting: true,
});
