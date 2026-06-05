import type { RootState } from "../store";

export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthRole = (state: RootState) => state.auth.role;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;