import { store } from '@redux';
// Import trực tiếp từ slice (không phải '~mdAuth/redux') để tránh vòng lặp:
// barrel đó re-export cả saga, mà saga lại import authApi từ file này.
import { authAction } from '~mdAuth/redux/slice';
import axios from 'axios';

const headers = {
  Accept: 'application/json',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/json',
};

export const BASE_URL_AUTH = process.env.NEXT_PUBLIC_API_BASE_URL;
const api = axios.create({
  baseURL: BASE_URL_AUTH,
  headers,
});

api.interceptors.request.use(
  config => {
    const accessToken = store.getState()?.authReducer?.tokenInfo?.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Trước đây accessToken hết hạn không hề được refresh - chỉ check "có giá
// trị hay không". BE đã có sẵn /auth/refreshToken, chỉ thiếu FE gọi tới.
// refreshPromise dùng chung cho mọi request 401 cùng lúc, tránh gọi refresh
// nhiều lần song song (ponytail: dedupe đơn giản bằng 1 promise module-level).
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const tokenInfo = store.getState()?.authReducer?.tokenInfo;
  if (!tokenInfo?.refreshToken) return null;
  try {
    const res = await axios.post(
      `${BASE_URL_AUTH}/auth/refreshToken`,
      { refreshToken: tokenInfo.refreshToken },
      {
        headers: {
          ...headers,
          Authorization: `Bearer ${tokenInfo.accessToken}`,
        },
      },
    );
    const newTokenInfo = res.data?.data;
    if (!newTokenInfo?.accessToken) return null;
    store.dispatch(authAction.setTokenInfo({ ...tokenInfo, ...newTokenInfo }));
    return newTokenInfo.accessToken;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const isAuthRoute = originalRequest?.url?.includes('/auth/');
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newAccessToken = await refreshPromise;
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
      store.dispatch(authAction.logout());
    }
    return Promise.reject(error);
  },
);

export default api;
