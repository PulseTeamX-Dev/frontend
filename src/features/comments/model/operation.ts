import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../../shared/api/apiClient";

import type { CommentsResponse } from "./types";

export const fetchComments = createAsyncThunk<
  CommentsResponse,
  { page?: number; limit?: number },
  { rejectValue: string }
>("comments/fetchComments", async ({ page = 1, limit = 10 }, thunkAPI) => {
  try {
    const { data } = await apiClient.get(
      `/dashboard/comments?page=${page}&limit=${limit}`,
    );

    return data.data;
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
      ).response?.data?.message ?? "Не вдалося завантажити коментарі",
    );
  }
});
