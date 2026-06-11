import { createSlice } from "@reduxjs/toolkit";

import { fetchComments } from "./operation";
import type { CommentsState } from "./types";

const initialState: CommentsState = {
  items: [],
  pagination: {
    current_page: 1,
    limit: 10,
    total_comments: 0,
    total_pages: 1,
    has_next_page: false,
    has_prev_page: false,
  },
  isLoading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.comments;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Не вдалося завантажити коментарі";
      });
  },
});

export const commentsReducer = commentsSlice.reducer;
