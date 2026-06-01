import type { RootState } from "../store";

export const selectMetrics = (state: RootState) => state.dashboard.metrics;

export const selectAlerts = (state: RootState) => state.dashboard.alerts;

export const selectDashboardLoading = (state: RootState) =>
  state.dashboard.isLoading;

export const selectDashboardError = (state: RootState) => state.dashboard.error;

export const selectDashboardSummary = (state: RootState) =>
  state.dashboard.metrics?.summary;

export const selectDashboardTrends = (state: RootState) =>
  state.dashboard.metrics?.trends ?? [];

export const selectDashboardRadar = (state: RootState) =>
  state.dashboard.metrics?.radar;
