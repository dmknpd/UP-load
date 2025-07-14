import axios from "axios";

import { useAuthStore } from "../store/useAuthStore";
import { BACKEND_HOST, BACKEND_PORT } from "../config/config";

const Api = axios.create({
  baseURL: `${BACKEND_HOST}:${BACKEND_PORT}/api`,
  withCredentials: true,
});

function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

function setAccessToken(token: string): void {
  useAuthStore.getState().setToken(token);
}

function logout(): void {
  useAuthStore.getState().clearAuth();
}

Api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default Api;
