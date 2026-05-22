import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardState } from "./types";

const initialState: DashboardState = {
  metrics: null,
  isLoading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = dashboardSlice.actions;
export const dashboardReducer = dashboardSlice.reducer;
