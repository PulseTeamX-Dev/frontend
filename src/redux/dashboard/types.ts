import type { HeatmapItem, HRMetrics } from "../../types/dashboard/types";

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
  overload_count: number;
  underload_count: number;
  response_count: number;
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
  message?: string;
  current_count?: number;
}

export type DashboardMetricsUnion = HRMetrics | TeamLeadMetrics;

export interface DashboardState {
  metrics: DashboardMetricsUnion | null;
  alerts: DashboardAlert[];
  isLoading: boolean;
  error: string | null;
}
