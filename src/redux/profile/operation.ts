import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../api/apiClient";

import type { Profile, UpdateProfilePayload } from "./types";

export const fetchProfile = createAsyncThunk<
  Profile,
  void,
  { rejectValue: string }
>("profile/fetchProfile", async (_, thunkAPI) => {
  try {
    const { data } = await apiClient.get("/profile/me");

    return data;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response?.data?.message ?? "Failed to fetch profile",
    );
  }
});

export const updateProfile = createAsyncThunk<
  Profile,
  UpdateProfilePayload,
  { rejectValue: string }
>("profile/updateProfile", async (payload, thunkAPI) => {
  try {
    const { data } = await apiClient.patch("/profile/me", payload);

    return data.user;
  } catch (error: unknown) {
    return thunkAPI.rejectWithValue(
      (
        error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        }
      ).response?.data?.message ?? "Failed to update profile",
    );
  }
});
