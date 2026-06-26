import axios from "axios";
import { SUPABASE_URL, SUPABASE_ANON_KEY, BASE_URL } from "../constants";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        // Робимо рефреш через Supabase
        const response = await axios.post(
          `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
          { refresh_token: refreshToken },
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
            },
          },
        );

        const { access_token, refresh_token: new_refresh_token } =
          response.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", new_refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        const currentPath = window.location.pathname;
        const isPublicRoute =
          currentPath.startsWith("/surveys/") ||
          currentPath.startsWith("/invite/") ||
          currentPath === "/update-password";

        if (!isPublicRoute && currentPath !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
