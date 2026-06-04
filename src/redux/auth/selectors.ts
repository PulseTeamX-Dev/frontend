import type { RootState } from "../store";

export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthUser = (state: RootState) => state.auth.user;
