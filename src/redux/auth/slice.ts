import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  validateInvite,
  acceptInvite,
  recoverPassword,
  updatePassword,
} from "./operation";
import type { User } from "./types";

export type InviteStatus =
  | "idle"
  | "loading"
  | "form"
  | "expired"
  | "used"
  | "success"
  | "invalid";

interface AuthState {
  user: User | null;
  role: "admin" | "hr" | "team_lead" | string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  inviteStatus: InviteStatus;
  isPasswordRecoverEmailSent: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: false,
  error: null,
  inviteStatus: "idle",
  isPasswordRecoverEmailSent: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Синхронний logout прибрали, тепер усе робить санка logoutUser
    resetInviteStatus: (state) => {
      state.inviteStatus = "idle";
    },
    resetRecoverStatus: (state) => {
      state.isPasswordRecoverEmailSent = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN ---
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- LOGOUT ---
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.inviteStatus = "idle";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Навіть якщо бекенд відбив логаут помилкою, на фронті краще скинути сесію:
        state.isAuthenticated = false;
        state.user = null;
      })

      // --- RECOVER PASSWORD ---
      .addCase(recoverPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isPasswordRecoverEmailSent = false;
      })
      .addCase(recoverPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isPasswordRecoverEmailSent = true;
      })
      .addCase(recoverPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- UPDATE PASSWORD ---
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- VALIDATE INVITE ---
      .addCase(validateInvite.pending, (state) => {
        state.inviteStatus = "loading";
      })
      .addCase(validateInvite.fulfilled, (state) => {
        state.inviteStatus = "form";
      })
      .addCase(validateInvite.rejected, (state, action) => {
        const payload = action.payload as { status: number; message: string };
        if (payload?.status === 409) state.inviteStatus = "used";
        else if (payload?.status === 410) state.inviteStatus = "expired";
        else state.inviteStatus = "invalid";
      })

      // --- ACCEPT INVITE ---
      .addCase(acceptInvite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptInvite.fulfilled, (state) => {
        state.isLoading = false;
        state.inviteStatus = "success";
      })
      .addCase(acceptInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetInviteStatus, resetRecoverStatus } = authSlice.actions;
export const authReducer = authSlice.reducer;
