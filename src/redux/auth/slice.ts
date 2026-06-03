import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./operation";
import type { User } from "./types";
import type { InviteContext } from "./types";
import { fetchInviteContext } from "./operation";

interface AuthState {
  user: User | null;
  role: "admin" | "hr" | "team_lead" | string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  invite: InviteContext | null;
}

const initialState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: false,
  error: null,
  invite: null,
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
      .addCase(fetchInviteContext.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInviteContext.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invite = action.payload;
      })
      .addCase(fetchInviteContext.rejected, (state) => {
        state.isLoading = false;
        state.error = "Invalid invite token";
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
