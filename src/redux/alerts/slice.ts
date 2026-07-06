import { createSlice } from "@reduxjs/toolkit";
import { fetchAlerts, fetchAlertsAnalytics, resolveAlert } from "./operation";
import type { AlertsState } from "../../features/alerts/model/types";

const initialState: AlertsState = {
  alerts: [],
  isLoading: false,
  error: null,
  analytics: null,
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
      })
      .addCase(resolveAlert.fulfilled, (state, action) => {
        const alert = state.alerts.find(
          (item) => item.alert_id === action.payload,
        );

        if (alert) {
          alert.resolved_at = new Date().toISOString();
        }

        state.alerts.sort((a, b) => {
          if (!a.resolved_at && b.resolved_at) return -1;
          if (a.resolved_at && !b.resolved_at) return 1;

          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
      })
      .addCase(fetchAlertsAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
      });
  },
});

export const alertsReducer = alertsSlice.reducer;
