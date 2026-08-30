import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQueryFetch = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: async (headers, { getState }: any) => {
    headers.set('Content-Type', 'application/json');

    const accessToken = getState()?.authReducer?.tokenInfo?.accessToken;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQueryFetch(args, api, extraOptions);
  return result;
};

export const baseQuery = createApi({
  reducerPath: 'RTKQueryHomeApi',
  baseQuery: baseQueryWithReauth,
  // Hầu hết API trong dự án không dùng tag ở đây — mọi nơi cần dữ liệu mới
  // đều tự gọi refetch() thủ công đúng lúc (nợ kỹ thuật xuyên suốt dự án).
  // Chỉ khai báo tag cho vài API thực sự có 1 mutation RTK làm thay đổi dữ
  // liệu mà 1 query RTK khác cần biết để tự refetch — PracticeTask (soạn đề
  // thực hành, CRUD đều qua RTK mutation) và ReminderLog (lịch sử nhắc nhở).
  // KHÔNG dùng cho video/quiz progress hay bài nộp thực hành vì các luồng đó
  // ghi dữ liệu qua axios/antd Upload thô, không qua RTK mutation, nên tag
  // không có gì để bắt — vẫn phải refetch() thủ công như cũ.
  tagTypes: ['PracticeTask', 'ReminderLog'],
  endpoints: () => ({}),
});
