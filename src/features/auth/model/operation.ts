import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { LoginCredentials, User } from "./types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/shared/lib/constants";
import { apiClient } from "../../../shared/api/apiClient";

export interface LoginPayload {
  user: User;
  role: string;
  access_token: string;
}

// --- LOGIN ---
export const loginUser = createAsyncThunk<LoginPayload, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        credentials,
        { headers: { apikey: SUPABASE_ANON_KEY } },
      );

      const { access_token, refresh_token, user } = response.data;
      const role = user?.user_metadata?.role || null;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      return { user, role, access_token };
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { error_description?: string } } })
          .response?.data?.error_description || "Помилка авторизації",
      );
    }
  },
);

// --- LOGOUT ---
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");

      // Якщо токена і так немає в сховищі, просто чистимося
      if (!token) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return;
      }

      await axios.post(
        `${SUPABASE_URL}/auth/v1/logout`,
        {},
        {
          headers: {
            apikey: SUPABASE_ANON_KEY, // Обов'язково для Supabase!
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Видаляємо токени після успішного запиту
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } catch (error: unknown) {
      // КРИТИЧНО: Якщо сервер повернув 403 (токен прострочений),
      // ми все одно видаляємо локальні токени, щоб юзер розлогінився!
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      const err = error as {
        response?: { data?: { error_description?: string } };
      };
      return rejectWithValue(
        err.response?.data?.error_description || "Помилка виходу з системи",
      );
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // 1. Беремо саме refresh_token, бо він живе довго
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token found");

      // 2. Стукаємо на спеціальний ендпоінт Supabase для оновлення сесії
      const response = await axios.post(
        `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
        { refresh_token: refreshToken },
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
          },
        },
      );

      // 3. Supabase повертає нам нові токени та актуального юзера!
      const { access_token, refresh_token, user } = response.data;
      const role = user?.user_metadata?.role || null;

      // 4. Одразу ж оновлюємо токени в localStorage на свіжі
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      return { user, role };
    } catch (error: unknown) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      const err = error as {
        response?: { data?: { error_description?: string } };
      };
      return rejectWithValue(
        err.response?.data?.error_description || "Не вдалося відновити сесію",
      );
    }
  },
);

// --- ЗАПИТ НА СКИДАННЯ ПАРОЛЯ (FORGOT PASSWORD) ---
export const recoverPassword = createAsyncThunk(
  "auth/recoverPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${SUPABASE_URL}/auth/v1/recover`,
        { email },
        { headers: { apikey: SUPABASE_ANON_KEY } },
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { error_description?: string } } })
          .response?.data?.error_description || "Помилка відправки листа",
      );
    }
  },
);

// --- ОНОВЛЕННЯ ПАРОЛЯ (ПІСЛЯ ПЕРЕХОДУ З ЛИСТА) ---
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (password: string, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${SUPABASE_URL}/auth/v1/user`,
        { password },
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            // Supabase автоматично ставить токен в URL при кліку з листа,
            // переконайся, що твій apiClient або роут правильно його підхоплює
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { error_description?: string } } })
          .response?.data?.error_description || "Помилка оновлення пароля",
      );
    }
  },
);

// --- INVITE ROUTES ---
export const validateInvite = createAsyncThunk(
  "auth/validateInvite",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(
        `/auth/invites/validate?token=${token}`,
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as {
        response?: { status: number; data?: { error?: string } };
      };

      if (err.response) {
        return rejectWithValue({
          status: err.response.status,
          message: err.response.data?.error || "Помилка валідації",
        });
      }
      return rejectWithValue({ status: 500, message: "Network error" });
    }
  },
);

export const acceptInvite = createAsyncThunk(
  "auth/acceptInvite",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiClient.post(`/auth/invites/accept`, {
        token,
        password,
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Failed to accept invite",
      );
    }
  },
);
