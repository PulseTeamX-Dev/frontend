import type { RootState } from "@/app/store";

export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthRole = (state: RootState) => state.auth.role;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectInviteStatus = (state: RootState) => state.auth.inviteStatus;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsPasswordRecoverEmailSent = (state: RootState) =>
  state.auth.isPasswordRecoverEmailSent;
