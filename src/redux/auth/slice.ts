import { createSlice } from "@reduxjs/toolkit";
import { loginUser, validateInvite, acceptInvite } from "./operation";
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
}

const initialState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: false,
  error: null,
  inviteStatus: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.inviteStatus = "idle";
    },
    resetInviteStatus: (state) => {
      state.inviteStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { logout, resetInviteStatus } = authSlice.actions;
export const authReducer = authSlice.reducer;
