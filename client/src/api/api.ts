import axios from "axios";

import { useAuthStore } from "../store/useAuthStore";
import { BACKEND_HOST, BACKEND_PORT } from "../config/config";
import { refreshToken } from "./apiAuth";

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
  useAuthStore.getState().logout();
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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(Api(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshToken();
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return Api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default Api;
