export interface DashboardSummary {
  team_id: number;
  team_name: string;
  week_start: string;
  response_count: number;
  stress_index: number;
  trust_index: number;
  workload_index: number;
  clarity_index: number;
  psychological_safety_index: number;
  burnout_risk_index: number;
  conflict_risk: number;
  workload_status: string;
  anonymity_trust_index: number;
}

export interface DashboardTrend {
  week_start: string;
  stress_index: number;
  alert_level: string;
}

export interface DashboardRadar {
  axis_trust: number;
  axis_clarity: number;
  axis_workload_balance: number;
  axis_stress_inv: number;
  axis_conflict_inv: number;
}

export interface DashboardMetrics {
  privacy_block: boolean;
  summary: DashboardSummary;
  trends: DashboardTrend[];
  radar: DashboardRadar;
  timestamp: string;
}

export interface DashboardAlert {
  alert_id: number;
  team_id: number;
  team_name: string;
  week_start: string;
  alert_level: string;
  alert_type: string;
  stress_index: number;
  stress_delta: number;
  metric_value: number;
  created_at: string;
  resolved_at: string | null;
  resolved_by: number | null;
  resolution_note: string | null;
}

export interface AlertsResponse {
  success: boolean;
  data: DashboardAlert[];
}

export interface DashboardState {
  metrics: DashboardMetrics | null;
  alerts: DashboardAlert[];
  isLoading: boolean;
  error: string | null;
}
