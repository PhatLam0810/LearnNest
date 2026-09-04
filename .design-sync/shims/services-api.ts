// Shim for `@services/api` used ONLY by the /design-sync bundle build - see
// .design-sync/NOTES.md "redux/services shim". The real module reads
// `process.env.NEXT_PUBLIC_API_BASE_URL` at module scope (throws outside
// Next's own build) and wires request/response interceptors against the
// real Redux store (`@redux`, also shimmed - see redux.ts) and an auth
// slice. None of that is safe or meaningful inside an isolated component
// preview - a component that actually fires a request in a preview should
// just get a rejected/pending promise, which a plain unconfigured axios
// instance already gives it.
import axios from 'axios';

export const BASE_URL_AUTH = '';

const api = axios.create({
  headers: { Accept: 'application/json' },
});

export default api;
