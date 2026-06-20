export interface Alert {
  alert_id: number;
  team_id: string;
  team_name: string;
  alert_level: "CRITICAL" | "WARNING";
  alert_type: string;
  alert_type_label: string;
  metric_value: number | null;
  created_at: string;
  resolved_at: string | null;
  resolved_by: number | null;
  resolution_note: string | null;
}

export interface AlertResolution {
  week_start: string;
  critical_total: number;
  critical_resolved: number;
  warning_total: number;
  warning_resolved: number;
  avg_resolution_hours: number;
  median_resolution_hours: number;
  resolution_rate_pct: number;
  unresolved_count: number;
}

export interface RetentionMetric {
  week_start: string;
  dashboard_role: string;
  active_users: number;
  total_users: number;
  avg_session_minutes: number;
  retention_rate_pct: number;
}

export interface AlertsAnalytics {
  alerts_resolution: AlertResolution[];
  retention_hr: RetentionMetric[];
  retention_team_lead: RetentionMetric[];
}

export interface AlertsState {
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
  analytics: AlertsAnalytics | null;
}
