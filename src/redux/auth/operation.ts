import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // Використовуємо чистий axios для Supabase
import type { LoginCredentials, User } from "./types";
import { apiClient } from "../../api/apiClient";
import type { ActivatePayload, InviteContext } from "./types";

export interface LoginPayload {
  user: User;
  role: string;
  access_token: string;
}

// 1. GET invite context
export const fetchInviteContext = createAsyncThunk<
  InviteContext,
  string
>("auth/fetchInviteContext", async (token) => {
  const res = await apiClient.get(`/auth/activate?token=${token}`);
  return res.data;
});
  

// 2. POST activate account
export const activateAccount = createAsyncThunk<
  string,
  ActivatePayload
>("auth/activateAccount", async (data) => {
  const res = await apiClient.post(`/auth/activate`, data);
  return res.data;
});

// Константи для Supabase (потім винесеш в .env)
const SUPABASE_URL = "https://rfzpkrjirdcxkplgkovt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vtcm2IM6H0prXC6kbss0Rg_c1E4oQQS";

export const loginUser = createAsyncThunk<LoginPayload, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Стукаємо прямо в Supabase
      const response = await axios.post(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        credentials,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY, // Supabase вимагає цей ключ у заголовку
          },
        },
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
