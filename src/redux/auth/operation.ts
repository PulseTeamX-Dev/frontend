import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { LoginCredentials, User } from "./types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../../constants";
import { apiClient } from "../../api/apiClient";

export interface LoginPayload {
  user: User;
  role: string;
  access_token: string;
}

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
            apikey: SUPABASE_ANON_KEY,
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
