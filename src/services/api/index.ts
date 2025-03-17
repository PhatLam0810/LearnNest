import { store } from '@redux';
import axios from 'axios';

const headers = {
  Accept: 'application/json',
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/json',
};

export const BASE_URL_AUTH =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:9999';
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

export default api;
