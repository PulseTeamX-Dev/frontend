import { createSlice } from "@reduxjs/toolkit";
import { fetchAlerts } from "./operation";
import type { AlertsState } from "./types";

const initialState: AlertsState = {
  alerts: [],
  isLoading: false,
  error: null,
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? null;
      });
  },
});

export const alertsReducer = alertsSlice.reducer;
