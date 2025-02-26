import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQueryFetch = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://[::1]:9999',
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
  endpoints: () => ({}),
});
