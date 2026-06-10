export interface HRMetricSummary {
  score: number;
  trend: number;
  worst_team: string;
}

export interface HRMetricsSummaryContainer {
  response_rate: HRMetricSummary;
  conflict_risk: HRMetricSummary;
  burnout_risk: HRMetricSummary;
  safety_feeling: HRMetricSummary;
  anonymity_trust: HRMetricSummary;
}

export interface HeatmapItem {
  team_id?: number;
  team_name: string;
  week_start: string;
  response_count: number;
  stress_index: number;
  trust_index: number;
  clarity_index: number;
  workload_strain_index: number;
  workload_min: number;
  workload_max: number;
  workload_status: string;
  overload_count?: number;
  underload_count?: number;
  workload_dispersion?: number;
  psychological_safety_index?: number;
  burnout_risk_index?: number;
  conflict_risk?: number;
  anonymity_trust_index?: number;
}

export interface EngagementData {
  survey_id: number;
  team_id: number;
  team_name: string;
  total_sent: number;
  responses: number;
  response_rate_pct: number;
  low_engagement_signal: boolean;
}

export interface HRRetentionItem {
  week_start: string;
  dashboard_role: string;
  active_users: number;
  total_users: number;
  retention_rate_pct: number;
  avg_session_minutes: number;
}

export interface HREngagementItem {
  survey_id: number;
  team_id: number;
  team_name: string;
  total_sent: number;
  responses: number;
  response_rate_pct: number;
  low_engagement_signal: boolean;
}

export interface HROperationsItem {
  week_start: string;
  alert_level: string;
  alert_type: string;
  total_alerts: number;
  resolved_count: number;
  resolution_rate_pct: number;
  avg_resolution_hours: number | null;
  median_resolution_hours: number | null;
  unresolved_count: number;
}

export interface HRMetrics {
  metrics_summary: HRMetricsSummaryContainer;
  metrics_history: HeatmapItem[]; // Теплова карта має ту саму структуру
  retention: HRRetentionItem[];
  engagement: HREngagementItem[];
  operations: HROperationsItem[];
}
