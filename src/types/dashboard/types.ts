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
  critical_overload: HRMetricSummary;
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

export interface HREngagementItem {
  survey_id: number;
  team_id: number;
  team_name: string;
  total_sent: number;
  responses: number;
  response_rate_pct: number;
  low_engagement_signal: boolean;
}

export interface HRWorkloadCurrent {
  team_name: string;
  workload_strain_index: number;
  workload_min: number;
  workload_max: number;
  workload_status: string;
}

export interface HRMetrics {
  metrics_summary: HRMetricsSummaryContainer;
  metrics_history: HeatmapItem[];
  workload_current: HRWorkloadCurrent[];
  engagement: HREngagementItem[];
}
