export const getLevel = (value: number, isRiskMetric: boolean) => {
  if (isRiskMetric) {
    if (value < 4) return "low";
    if (value < 7) return "medium";
    return "high";
  }
  if (value >= 7) return "low";
  if (value >= 5) return "medium";
  return "high";
};
