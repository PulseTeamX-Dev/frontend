export interface Alert {
  id: string;
  team_id: string;
  team_name: string;
  alert_type: string;
  created_at: string;
  is_resolved: boolean;
}

export interface AlertsState {
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
}
