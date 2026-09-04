// Shim for `@redux/RTKQuery` used ONLY by the /design-sync bundle build -
// see .design-sync/NOTES.md "redux/services shim". Several modules
// (src/modules/admin/redux/RTKQuery, src/modules/auth/redux/RTKQuery) reach
// the ROOT src/redux/RTKQuery/index.ts directly via this deep alias
// (bypassing the `@redux` barrel, which is shimmed separately) to call
// `baseQuery.injectEndpoints(...)` and add their own endpoints. The real
// file reads `process.env.NEXT_PUBLIC_API_BASE_URL` at module scope - a
// bare (non-typeof-guarded) `process` reference that throws outside Next's
// own build. This shim is otherwise identical real RTK Query machinery (so
// `.injectEndpoints(...)` downstream keeps working exactly as it does in
// the app) with just a safe, empty base URL instead.
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQueryFetch = fetchBaseQuery({
  baseUrl: '',
  prepareHeaders: async (headers) => headers,
});

export const baseQuery = createApi({
  reducerPath: 'RTKQueryHomeApi',
  baseQuery: baseQueryFetch,
  tagTypes: ['PracticeTask', 'ReminderLog'],
  endpoints: () => ({}),
});
