import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProfileState } from "./types";
import { fetchProfile, updateProfile } from "./operation";

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

const handlePending = (state: ProfileState) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (
  state: ProfileState,
  action: PayloadAction<string | undefined>,
) => {
  state.isLoading = false;
  state.error = action.payload ?? "Something went wrong";
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchProfile
      .addCase(fetchProfile.pending, handlePending)
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, handleRejected)

      // updateProfile
      .addCase(updateProfile.pending, handlePending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, handleRejected);
  },
});

export const { clearProfile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
