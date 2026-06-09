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
