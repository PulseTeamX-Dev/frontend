import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardState } from "./types";
import { fetchMetrics, fetchAlerts } from "./operation";

const initialState: DashboardState = {
  metrics: null,
  alerts: [],
  isLoading: false,
  error: null,
};

const handlePending = (state: DashboardState) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (
  state: DashboardState,
  action: PayloadAction<string | undefined>,
) => {
  state.isLoading = false;
  state.error = action.payload ?? "Something went wrong";
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // metrics
      .addCase(fetchMetrics.pending, handlePending)
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload; // Тут TS тепер знає, що це HRMetrics або TeamLeadMetrics
      })
      .addCase(fetchMetrics.rejected, handleRejected)

      // alerts
      .addCase(fetchAlerts.pending, handlePending)
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alerts = action.payload.data;
      })
      .addCase(fetchAlerts.rejected, handleRejected);
  },
});

export const dashboardReducer = dashboardSlice.reducer;
