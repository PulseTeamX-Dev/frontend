import Icon from "../../../shared/Icon";

interface MetricsHistoryItemProps {
  value: number | null | undefined;
  metricKey: string;
}

const MetricsHistoryItem = ({ value, metricKey }: MetricsHistoryItemProps) => {
  if (value === null || value === undefined) {
    return (
      <div className="h-14 md:h-16 rounded-xl bg-grayscale-200 flex items-center justify-center opacity-50">
        <Icon id="lock" className="w-6 h-6 text-grayscale-700" />
      </div>
    );
  }

  const isRiskMetric = metricKey === "stress_index";

  const getLevel = () => {
    if (isRiskMetric) {
      if (value < 4) return "low";
      if (value < 7) return "medium";
      return "high";
    }
    if (value > 7) return "low";
    if (value > 5) return "medium";
    return "high";
  };

  const level = getLevel();

  const styles: Record<string, string> = {
    low: "bg-green-50 text-green-700",
    medium: "bg-yellow-200 text-yellow-800",
    high: "bg-red-500 text-white",
  };

  return (
    <div
      className={`h-14 md:h-16 rounded-xl flex items-center justify-center text-[18px] font-medium transition-colors duration-300 ${styles[level]}`}
    >
      {value.toFixed(1)}
    </div>
  );
};

export default MetricsHistoryItem;
