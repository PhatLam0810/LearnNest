import { baseQuery } from '@redux/RTKQuery';
import { AxiosResponse } from 'axios';
import { FeedbackItem } from '~mdDashboard/types';
import { LibraryType } from '~mdDashboard/redux/RTKQuery/types';
import { Category } from '~mdDashboard/redux/saga/type';
import {
  CreateUserParams,
  DeleteAdminRoleParams,
  ImportUserItem,
  ImportUserPreviewRequest,
  ImportUserPreviewResponse,
  ImportEnvelope,
  AdminOverview,
  ClassCourseItem,
  AssignClassCourseBody,
  ClassProgressStatus,
  ClassProgressResponse,
  RemindLearningResult,
  ImportUsersRequest,
  ImportUsersResponse,
  CreateMockExamPayload,
  CreateQuizPayload,
  Quiz,
  QuestionBankItem,
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
  ClassAssignmentItem,
  AssignTaskPayload,
  AssignTaskBulkPayload,
  AssignTaskBulkResult,
  LessonAssignmentItem,
  ClassCodeOption,
  ClassItem,
  ClassListParams,
  ClassListResponse,
  ClassMembersParams,
  ClassMembersResponse,
  CreateClassBody,
  UpdateClassBody,
  MoveClassMembersResult,
  CommentReportList,
  CommentReportStatus,
  ClassOverviewItem,
  ClassRoster,
  CreateClassWithAssignmentPayload,
  RemindClassResult,
  SelectableUser,
  OverridePracticePayload,
  PracticeSubmissionDetail,
  QuizResultDetail,
  RegradeTaskResult,
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
  MockExam,
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

// Đổi thành viên 1 lớp làm mới: danh sách lớp (memberCount), chi tiết + học
// viên của lớp đó, và roster ở tab "Bài giao" (tag PracticeClassOverview).
// Gán/đổi/gỡ khóa của lớp làm mới danh sách khóa, số khóa ở danh sách lớp và
// bảng tiến độ (cả lớp được ghi danh lại).
const classCourseTags = (classId: string) => [
  { type: 'Class' as const, id: 'LIST' },
  { type: 'Class' as const, id: classId },
  { type: 'Class' as const, id: `courses-${classId}` },
  { type: 'Class' as const, id: `progress-${classId}` },
];

const classMembersTags = (classId: string) => [
  { type: 'Class' as const, id: 'LIST' },
  { type: 'Class' as const, id: classId },
  { type: 'PracticeClassOverview' as const, id: classId },
];

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

    // Card "Tổng người dùng" + "Hoạt động hôm nay" - Quản Trị Người Dùng.
    getUserActivitySummary: builder.query<
      {
        totalUsers: number;
        newUsersLast7Days: number;
        activeToday: number;
        activeTodayPercent: number;
      },
      void
    >({
      query: () => '/analytics/user-activity-summary',
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    getLibraryById: builder.query<any, string>({
      query: (id: string) => ({
        url: `library/${id}`,
        method: 'GET',
      }),
      // Modal Cập nhật bài học đọc bản đầy đủ (có questionList) - phải tự làm
      // mới sau khi sửa/xóa, nếu không mở lại sẽ lấy bản cache cũ và gửi đè.
      providesTags: (_result, _error, id) => [{ type: 'Library', id }],
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
      invalidatesTags: (_result, _error, { _id }) => [
        { type: 'Library', id: _id },
      ],
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    updateModule: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'lesson/updateModule',
        method: 'PUT',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    updateLibrary: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'library',
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { _id }) => [
        { type: 'Library', id: _id },
      ],
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    createFeedback: builder.mutation<any, any>({
      query: (body: any) => ({
        url: 'feedback',
        method: 'POST',
        body,
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
    // 3 route import: controller BE luôn trả HTTP 201 kèm statusCode TRONG body
    // (400 = lỗi nghiệp vụ, data null) nên fetchBaseQuery không coi là lỗi -
    // gộp statusCode/message vào kết quả để nơi gọi tự kiểm.
    previewImportUsers: builder.mutation<
      ImportUserPreviewResponse,
      ImportUserPreviewRequest
    >({
      query: body => ({
        url: 'admin/users/import/preview',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ImportEnvelope<ImportUserItem[]>) => ({
        statusCode: res.statusCode,
        message: res.message,
        users: res.data ?? [],
      }),
    }),
    importUsersBulk: builder.mutation<ImportUsersResponse, ImportUsersRequest>({
      query: body => ({
        url: 'admin/users/import/bulk',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ImportEnvelope<ImportUsersResponse>) => ({
        successful: [],
        failed: [],
        accounts: [],
        ...res.data,
        statusCode: res.statusCode,
        message: res.message,
      }),
      invalidatesTags: (_r, _e, { classId }) =>
        classId ? classMembersTags(classId) : [],
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
      transformResponse: (res: ImportEnvelope<SendImportEmailsResponse>) => ({
        successful: 0,
        failed: 0,
        details: [],
        ...res.data,
        statusCode: res.statusCode,
        message: res.message,
      }),
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
    // Sửa lại đúng route thật của BE (admin.controller.ts
    // getPracticeClassesByLesson là POST 'practice-classes', KHÔNG có
    // :lessonId trong URL - trước đây hook này gọi sai URL
    // (GET admin/practice-classes/:lessonId, không khớp route nào cả) và
    // chưa từng được dùng ở đâu nên không ai phát hiện. lessonId lọc qua
    // filter, đúng cách paginationService.paginate xử lý (model.find(filter)
    // trực tiếp).
    getPracticeClasses: builder.query<
      PracticeClassListResponse,
      { lessonId: string; search?: string; pageNum?: number; pageSize?: number }
    >({
      query: ({ lessonId, ...params }) => ({
        url: `admin/practice-classes`,
        method: 'POST',
        body: { ...params, filter: { lessonId } },
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
    addPracticeClassMembers: builder.mutation<
      { added: number; count: number },
      { classId: string; userIds: string[] }
    >({
      query: ({ classId, userIds }) => ({
        url: `admin/practice-classes/${classId}/members`,
        method: 'POST',
        body: { userIds },
      }),
      transformResponse: (res: any) => res?.data ?? res,
      invalidatesTags: (_r, _e, { classId }) => classMembersTags(classId),
    }),
    removePracticeClassMember: builder.mutation<
      { count: number },
      { classId: string; userId: string }
    >({
      query: ({ classId, userId }) => ({
        url: `admin/practice-classes/${classId}/members/${userId}`,
        method: 'DELETE',
      }),
      transformResponse: (res: any) => res?.data ?? res,
      invalidatesTags: (_r, _e, { classId }) => classMembersTags(classId),
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
    // Đối xứng remindNotPassedTask nhưng cho bài trắc nghiệm.
    remindNotPassedQuiz: builder.mutation<
      RemindLearnersBulkResponse,
      { lessonId: string; libraryId: string }
    >({
      query: ({ lessonId, libraryId }) => ({
        url: `admin/lessons/${lessonId}/quizzes/${libraryId}/remind-not-passed`,
        method: 'POST',
      }),
      transformResponse: (res: any) => res.data,
      invalidatesTags: (_result, _error, { lessonId, libraryId }) => [
        {
          type: 'ReminderLog',
          id: reminderLogTagId(lessonId, 'quiz', libraryId),
        },
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

    // ---- Đề thi thử (mock exam, admin soạn đề) ----
    getMockExamsAdmin: builder.query<MockExam[], void>({
      query: () => ({ url: 'practice/mock-exams/admin/all', method: 'GET' }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: result =>
        result
          ? [
              ...result.map(e => ({ type: 'MockExam' as const, id: e._id })),
              { type: 'MockExam' as const, id: 'LIST' },
            ]
          : [{ type: 'MockExam' as const, id: 'LIST' }],
    }),
    createMockExam: builder.mutation<MockExam, CreateMockExamPayload>({
      query: body => ({ url: 'practice/mock-exams', method: 'POST', body }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: [{ type: 'MockExam', id: 'LIST' }],
    }),
    updateMockExam: builder.mutation<
      MockExam,
      { examId: string; body: Partial<CreateMockExamPayload> }
    >({
      query: ({ examId, body }) => ({
        url: `practice/mock-exams/${examId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_result, _error, { examId }) => [
        { type: 'MockExam', id: examId },
        { type: 'MockExam', id: 'LIST' },
      ],
    }),
    deleteMockExam: builder.mutation<void, string>({
      query: examId => ({
        url: `practice/mock-exams/${examId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, examId) => [
        { type: 'MockExam', id: examId },
        { type: 'MockExam', id: 'LIST' },
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
      providesTags: [{ type: 'PracticeSubmission', id: 'LIST' }],
    }),
    getPracticeSubmissionDetail: builder.query<
      PracticeSubmissionDetail,
      string
    >({
      query: id => `practice/admin/submissions/${id}`,
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'PracticeSubmission', id }],
    }),
    overridePracticeSubmission: builder.mutation<
      PracticeSubmissionDetail,
      OverridePracticePayload
    >({
      query: ({ id, score, comment }) => ({
        url: `practice/admin/submissions/${id}/override`,
        method: 'PUT',
        body: { score, comment },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'PracticeSubmission', id },
        { type: 'PracticeSubmission', id: 'LIST' },
      ],
    }),
    regradePracticeSubmission: builder.mutation<
      PracticeSubmissionDetail,
      string
    >({
      query: id => ({
        url: `practice/admin/submissions/${id}/regrade`,
        method: 'POST',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_r, _e, id) => [
        { type: 'PracticeSubmission', id },
        { type: 'PracticeSubmission', id: 'LIST' },
      ],
    }),
    regradePracticeTask: builder.mutation<RegradeTaskResult, string>({
      query: taskId => ({
        url: `practice/admin/tasks/${taskId}/regrade`,
        method: 'POST',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: [{ type: 'PracticeSubmission' }],
    }),
    exportPracticeSubmissions: builder.mutation<Blob, string>({
      query: taskId => ({
        url: `practice/admin/tasks/${taskId}/submissions/export`,
        method: 'GET',
        responseHandler: response => response.blob(),
      }),
    }),
    downloadPracticeSubmissions: builder.mutation<Blob, string>({
      query: taskId => ({
        url: `practice/admin/tasks/${taskId}/submissions/download`,
        method: 'GET',
        responseHandler: response => response.blob(),
      }),
    }),
    getQuizResultDetail: builder.query<QuizResultDetail, string>({
      query: id => `lesson/admin/results/${id}`,
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    exportQuizResults: builder.mutation<Blob, string>({
      query: libraryId => ({
        url: `lesson/admin/library/${libraryId}/results/export`,
        method: 'GET',
        responseHandler: response => response.blob(),
      }),
    }),
    getPracticeClassOverview: builder.query<ClassOverviewItem[], string | void>(
      {
        query: search => ({
          url: 'admin/practice-classes/overview',
          method: 'GET',
          params: search ? { search } : undefined,
        }),
        transformResponse: (res: AxiosResponse<any>) => res.data,
        providesTags: [{ type: 'PracticeClassOverview', id: 'LIST' }],
      },
    ),
    getPracticeClassRoster: builder.query<
      ClassRoster,
      { classId: string; assignmentId?: string }
    >({
      query: ({ classId, assignmentId }) => ({
        url: `admin/practice-classes/${classId}/roster`,
        method: 'GET',
        params: assignmentId ? { assignmentId } : undefined,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_r, _e, { classId }) => [
        { type: 'PracticeClassOverview', id: classId },
      ],
    }),
    createClassWithAssignment: builder.mutation<
      { _id: string; memberCount: number },
      CreateClassWithAssignmentPayload
    >({
      query: body => ({
        url: 'admin/practice-classes/with-assignment',
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: [
        { type: 'PracticeClassOverview', id: 'LIST' },
        { type: 'Class', id: 'LIST' },
      ],
    }),
    remindClassAssignment: builder.mutation<
      RemindClassResult,
      { classId: string; assignmentId: string }
    >({
      query: ({ classId, assignmentId }) => ({
        url: `admin/practice-classes/${classId}/assignments/${assignmentId}/remind`,
        method: 'POST',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    searchSelectableUsers: builder.query<SelectableUser[], string>({
      query: search => ({
        url: 'user/getListUser',
        method: 'POST',
        body: { pageNum: 1, pageSize: 20, search },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data.items,
    }),
    getClassCodeOptions: builder.query<ClassCodeOption[], void>({
      query: () => ({
        url: 'tag/getAll',
        method: 'POST',
        body: { pageNum: 1, pageSize: 100 },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data.items,
    }),
    // ---- "Lớp học" (nhóm học viên theo học kỳ, chưa bắt buộc gắn khóa) ----
    getClasses: builder.query<ClassListResponse, ClassListParams>({
      query: params => ({ url: 'admin/classes', method: 'GET', params }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: [{ type: 'Class', id: 'LIST' }],
    }),
    getClassById: builder.query<ClassItem, string>({
      query: classId => ({ url: `admin/classes/${classId}`, method: 'GET' }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_r, _e, classId) => [{ type: 'Class', id: classId }],
    }),
    createClass: builder.mutation<ClassItem, CreateClassBody>({
      query: body => ({ url: 'admin/classes', method: 'POST', body }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: [{ type: 'Class', id: 'LIST' }],
    }),
    updateClass: builder.mutation<
      ClassItem,
      { classId: string; body: UpdateClassBody }
    >({
      query: ({ classId, body }) => ({
        url: `admin/classes/${classId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_r, _e, { classId }) => [
        { type: 'Class', id: 'LIST' },
        { type: 'Class', id: classId },
      ],
    }),
    // Roster phân trang của 1 lớp (BE: POST practice-classes/:classId/users).
    getClassMembers: builder.query<ClassMembersResponse, ClassMembersParams>({
      query: ({ classId, ...body }) => ({
        url: `admin/practice-classes/${classId}/users`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_r, _e, { classId }) => [{ type: 'Class', id: classId }],
    }),
    moveClassMembers: builder.mutation<
      MoveClassMembersResult,
      { classId: string; toClassId: string; userIds: string[] }
    >({
      query: ({ classId, toClassId, userIds }) => ({
        url: `admin/classes/${classId}/members/move`,
        method: 'POST',
        body: { userIds, toClassId },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_r, _e, { classId, toClassId }) => [
        ...classMembersTags(classId),
        ...classMembersTags(toClassId),
      ],
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
    // Giao 1 đề thực hành cho cả lớp kèm hạn nộp — upsert phía BE, giao lại
    // cùng 1 đề chỉ đổi hạn nộp thay vì tạo bản ghi trùng.
    assignTaskToClass: builder.mutation<
      ClassAssignmentItem,
      { classId: string; body: AssignTaskPayload }
    >({
      query: ({ classId, body }) => ({
        url: `admin/practice-classes/${classId}/assignments`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_result, _error, { classId }) => [
        { type: 'ClassAssignment', id: classId },
      ],
    }),
    getClassAssignments: builder.query<ClassAssignmentItem[], string>({
      query: classId => ({
        url: `admin/practice-classes/${classId}/assignments`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_result, _error, classId) => [
        { type: 'ClassAssignment', id: classId },
      ],
    }),
    removeClassAssignment: builder.mutation<
      void,
      { classId: string; assignmentId: string }
    >({
      query: ({ classId, assignmentId }) => ({
        url: `admin/practice-classes/${classId}/assignments/${assignmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { classId }) => [
        { type: 'ClassAssignment', id: classId },
      ],
    }),
    // File CSV, giống hệt pattern exportLearners (blob) ở trên nhưng khác
    // định dạng (điểm số theo bài giao thay vì roster).
    exportClassGrades: builder.mutation<Blob, { classId: string }>({
      query: ({ classId }) => ({
        url: `admin/practice-classes/${classId}/grades.csv`,
        method: 'GET',
        responseHandler: response => response.blob(),
      }),
    }),
    // ---- Trang "Giao Bài" ----
    assignTaskToClassesBulk: builder.mutation<
      AssignTaskBulkResult,
      AssignTaskBulkPayload
    >({
      query: body => ({
        url: `admin/practice-classes/assignments/bulk`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    getLessonAssignments: builder.query<LessonAssignmentItem[], string>({
      query: lessonId => ({
        url: `admin/lessons/${lessonId}/assignments`,
        method: 'GET',
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),

    // Ảnh nền khóa học (CreateCourseModal) - cùng route /upload dùng chung
    // toàn dự án (avatar, video/PDF thư viện, ảnh bình luận...). BE bọc
    // kết quả qua responseService.single() -> {data: url}.
    uploadImage: builder.mutation<string, FormData>({
      query: formData => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (res: any) => res.data,
    }),

    // ---- Báo Cáo Vi Phạm (bình luận) ----
    getCommentReports: builder.query<
      CommentReportList,
      { status: CommentReportStatus; pageNum: number }
    >({
      query: ({ status, pageNum }) => ({
        url: '/comments/admin/reports/list',
        method: 'POST',
        body: { pageNum, pageSize: 10, filter: { status } },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: [{ type: 'CommentReport' }],
    }),
    resolveCommentReport: builder.mutation<
      any,
      { reportId: string; action: 'hide' | 'dismiss' }
    >({
      query: ({ reportId, action }) => ({
        url: `/comments/admin/reports/${reportId}/resolve`,
        method: 'POST',
        body: { action },
      }),
      invalidatesTags: [{ type: 'CommentReport' }],
    }),
    // CommentService.warnUser (BE) trả thẳng {sent, warnedAt}, không bọc
    // qua responseService.single() như các API khác trong file này.
    warnCommentUser: builder.mutation<
      { sent: boolean; warnedAt: string },
      string
    >({
      query: reportId => ({
        url: `/comments/admin/reports/${reportId}/warn`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'CommentReport' }],
    }),

    // ---- Phản Hồi Người Dùng ----
    toggleFeedbackResolved: builder.mutation<FeedbackItem, string>({
      query: id => ({
        url: `/feedback/${id}/resolve`,
        method: 'POST',
      }),
      transformResponse: (res: AxiosResponse<FeedbackItem>) => res.data,
    }),
    replyFeedback: builder.mutation<
      FeedbackItem & { sent: boolean },
      { id: string; message: string }
    >({
      query: ({ id, message }) => ({
        url: `/feedback/${id}/reply`,
        method: 'POST',
        body: { message },
      }),
      transformResponse: (
        res: AxiosResponse<FeedbackItem & { sent: boolean }>,
      ) => res.data,
    }),

    // ---- Tạo Bài Tập (quiz trắc nghiệm nhiều đáp án đúng) ----
    getQuizzes: builder.query<Quiz[], string | void>({
      query: libraryId => ({
        url: 'quiz',
        method: 'GET',
        params: libraryId ? { libraryId } : undefined,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: result =>
        result
          ? [
              ...result.map(q => ({ type: 'Quiz' as const, id: q._id })),
              { type: 'Quiz' as const, id: 'LIST' },
            ]
          : [{ type: 'Quiz' as const, id: 'LIST' }],
    }),
    getQuizDetail: builder.query<Quiz, string>({
      query: id => ({ url: `quiz/${id}`, method: 'GET' }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_result, _error, id) => [{ type: 'Quiz', id }],
    }),
    createQuiz: builder.mutation<Quiz, CreateQuizPayload>({
      query: body => ({ url: 'quiz', method: 'POST', body }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: [
        { type: 'Quiz', id: 'LIST' },
        { type: 'QuestionBank', id: 'LIST' },
      ],
    }),
    updateQuiz: builder.mutation<
      Quiz,
      { id: string; body: Partial<CreateQuizPayload> }
    >({
      query: ({ id, body }) => ({ url: `quiz/${id}`, method: 'PUT', body }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Quiz', id },
        { type: 'Quiz', id: 'LIST' },
      ],
    }),
    deleteQuiz: builder.mutation<void, string>({
      query: id => ({ url: `quiz/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Quiz', id },
        { type: 'Quiz', id: 'LIST' },
      ],
    }),
    getQuestionBank: builder.query<QuestionBankItem[], string | void>({
      query: search => ({
        url: 'quiz/question-bank',
        method: 'GET',
        params: search ? { search } : undefined,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: [{ type: 'QuestionBank', id: 'LIST' }],
    }),
    getClassCourses: builder.query<ClassCourseItem[], string>({
      query: classId => `admin/classes/${classId}/courses`,
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_r, _e, classId) => [
        { type: 'Class', id: `courses-${classId}` },
      ],
    }),
    assignClassCourse: builder.mutation<
      ClassCourseItem,
      { classId: string; body: AssignClassCourseBody }
    >({
      query: ({ classId, body }) => ({
        url: `admin/classes/${classId}/courses`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_r, _e, { classId }) => classCourseTags(classId),
    }),
    updateClassCourse: builder.mutation<
      ClassCourseItem,
      {
        classId: string;
        lessonId: string;
        body: Omit<AssignClassCourseBody, 'lessonId'>;
      }
    >({
      query: ({ classId, lessonId, body }) => ({
        url: `admin/classes/${classId}/courses/${lessonId}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      invalidatesTags: (_r, _e, { classId }) => classCourseTags(classId),
    }),
    removeClassCourse: builder.mutation<
      void,
      { classId: string; lessonId: string }
    >({
      query: ({ classId, lessonId }) => ({
        url: `admin/classes/${classId}/courses/${lessonId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { classId }) => classCourseTags(classId),
    }),
    getClassProgress: builder.query<
      ClassProgressResponse,
      { classId: string; lessonId: string; status?: ClassProgressStatus }
    >({
      query: ({ classId, lessonId, status }) => ({
        url: `admin/classes/${classId}/progress`,
        method: 'GET',
        params: { lessonId, ...(status ? { status } : {}) },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: (_r, _e, { classId }) => [
        { type: 'Class', id: `progress-${classId}` },
      ],
    }),
    remindClassLearning: builder.mutation<
      RemindLearningResult,
      { classId: string; lessonId: string; dryRun?: boolean }
    >({
      query: ({ classId, lessonId, dryRun }) => ({
        url: `admin/classes/${classId}/remind-learning`,
        method: 'POST',
        body: { lessonId, dryRun },
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    exportClassProgress: builder.mutation<
      Blob,
      { classId: string; lessonId: string }
    >({
      query: ({ classId, lessonId }) => ({
        url: `admin/classes/${classId}/progress-export`,
        method: 'POST',
        body: { lessonId },
        responseHandler: response => response.blob(),
      }),
    }),
    getAdminOverview: builder.query<AdminOverview, void>({
      query: () => 'admin/overview',
      transformResponse: (res: AxiosResponse<any>) => res.data,
      providesTags: [{ type: 'Class', id: 'OVERVIEW' }],
    }),
    emailWeeklySummary: builder.mutation<
      { sent: boolean },
      { dryRun?: boolean } | void
    >({
      query: body => ({
        url: 'admin/overview/weekly-summary/email',
        method: 'POST',
        body: body ?? {},
      }),
      transformResponse: (res: AxiosResponse<any>) => res.data,
    }),
    exportAtRisk: builder.mutation<Blob, void>({
      query: () => ({
        url: 'admin/overview/at-risk-export',
        method: 'POST',
        body: {},
        responseHandler: response => response.blob(),
      }),
    }),
    exportUsers: builder.mutation<
      Blob,
      { search?: string; filter?: { userType?: string } }
    >({
      query: body => ({
        url: 'user/exportUsers',
        method: 'POST',
        body,
        responseHandler: response => response.blob(),
      }),
    }),
    exportClassesReport: builder.mutation<Blob, void>({
      query: () => ({
        url: 'admin/classes/report-export',
        method: 'POST',
        body: {},
        responseHandler: response => response.blob(),
      }),
    }),
  }),
  overrideExisting: true,
});
