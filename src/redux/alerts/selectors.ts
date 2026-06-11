import type { RootState } from "../store";

export const selectAlerts = (state: RootState) => state.alerts.alerts;

export const selectAlertsLoading = (state: RootState) => state.alerts.isLoading;

export const selectUnresolvedAlertsCount = (state: RootState) =>
  state.alerts.alerts.filter((alert) => !alert.is_resolved).length;
