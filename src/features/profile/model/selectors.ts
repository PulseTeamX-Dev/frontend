import type { RootState } from "@/app/store";

export const selectProfile = (state: RootState) => state.profile.profile;

export const selectProfileLoading = (state: RootState) =>
  state.profile.isLoading;

export const selectProfileError = (state: RootState) => state.profile.error;

export const selectProfileEmail = (state: RootState) =>
  state.profile.profile?.email;

export const selectProfileName = (state: RootState) =>
  state.profile.profile?.full_name;

export const selectProfileAvatar = (state: RootState) =>
  state.profile.profile?.avatar_url;

export const selectProfileRole = (state: RootState) =>
  state.profile.profile?.dashboard_role;

export const selectProfileTitle = (state: RootState) =>
  state.profile.profile?.custom_title;
