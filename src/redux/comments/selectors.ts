import type { RootState } from "../store";

export const selectComments = (state: RootState) => state.comments.items;

export const selectCommentsPagination = (state: RootState) =>
  state.comments.pagination;

export const selectCommentsLoading = (state: RootState) =>
  state.comments.isLoading;

export const selectCommentsError = (state: RootState) => state.comments.error;
