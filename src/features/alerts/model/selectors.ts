import type { RootState } from "@/app/store";

export const selectAlerts = (state: RootState) => state.alerts.alerts;

export const selectAlertsLoading = (state: RootState) => state.alerts.isLoading;

export const selectUnresolvedAlertsCount = (state: RootState) =>
  state.alerts.alerts.filter((alert) => !alert.resolved_at).length;

export const selectAlertsAnalytics = (state: RootState) =>
  state.alerts.analytics;
