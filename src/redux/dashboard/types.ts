// --- ЗАГАЛЬНІ ТИПИ ---

import type { HRMetricsSummaryContainer } from "../../types/dashboard/types";

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
  // Додаткові індекси, які можуть бути
  overload_count?: number;
  underload_count?: number;
  workload_dispersion?: number;
  psychological_safety_index?: number;
  burnout_risk_index?: number;
  conflict_risk?: number;
  anonymity_trust_index?: number;
}

export interface DashboardAlert {
  alert_id: number;
  team_id: number;
  team_name: string;
  week_start: string;
  alert_level: string;
  alert_type: string;
  stress_index: number | null;
  stress_delta: number | null;
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

// --- ТИПИ ДЛЯ ТІМЛІДА ---

export interface TopCardMetric {
  score: number;
  trend: number;
}

export interface EngagementCard {
  pct: number;
  responded: number;
  total_sent: number;
}

export interface WorkloadMetric {
  score: number;
  min: number;
  max: number;
  status: string;
}

export interface RadarData {
  team_id: number;
  team_name: string;
  week_start: string;
  axis_trust: number;
  axis_clarity: number;
  axis_workload_balance: number;
  axis_stress_inv: number;
  axis_conflict_inv: number;
}

export interface TeamLeadMetrics {
  privacy_block: boolean;
  top_cards: {
    engagement: EngagementCard;
    trust: TopCardMetric;
    stress: TopCardMetric;
  };
  heatmap: HeatmapItem[];
  workload: WorkloadMetric;
  radar: RadarData[];
  timestamp: string;
  // Якщо є privacy block, бек може повернути ці поля
  message?: string;
  current_count?: number;
}

// --- ТИПИ ДЛЯ HR ---
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

// --- ФІНАЛЬНИЙ СТЕЙТ REDUX ---

// Оскільки бекенд віддає різне для HR і TL, метрики можуть бути будь-яким з цих двох типів.
// На фронтенді доведеться перевіряти тип (наприклад, перевіряючи наявність поля `top_cards` або `metrics_summary`)
export type DashboardMetricsUnion = HRMetrics | TeamLeadMetrics;

export interface DashboardState {
  metrics: DashboardMetricsUnion | null;
  alerts: DashboardAlert[];
  isLoading: boolean;
  error: string | null;
}
