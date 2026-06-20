import Icon from "../../../shared/Icon";

interface MetricsHistoryItemProps {
  value: number | null | undefined;
  metricKey: string;
  isCurrentWeek: boolean;
}

const MetricsHistoryItem = ({
  value,
  metricKey,
  isCurrentWeek,
}: MetricsHistoryItemProps) => {
  if (value === null || value === undefined) {
    return (
      <div className="w-full h-full min-h-[56px] rounded-xl bg-grayscale-200 flex items-center justify-center opacity-50">
        {isCurrentWeek ? (
          <Icon id="lock" className="w-6 h-6 text-grayscale-700" />
        ) : (
          <Icon id="face-sad" className="w-6 h-6 text-grayscale-700" />
        )}
      </div>
    );
  }

  const isRiskMetric =
    metricKey === "stress_index" || metricKey === "workload_strain_index";

  const getLevel = () => {
    if (isRiskMetric) {
      if (value < 4) return "low";
      if (value < 7) return "medium";
      return "high";
    }
    if (value >= 7) return "low";
    if (value >= 5) return "medium";
    return "high";
  };

  const level = getLevel();

  const styles: Record<string, string> = {
    low: "bg-green-100 text-[#10b981]",
    medium: "bg-yellow-200 text-[#d97706]",
    high: "bg-red-600 text-white",
  };

  return (
    <div
      className={`w-full h-full min-h-[56px] rounded-xl flex items-center justify-center text-[17px] md:text-[18px] font-medium transition-colors duration-300 ${styles[level]}`}
    >
      {value.toFixed(1).replace(".", ",")}
    </div>
  );
};

export default MetricsHistoryItem;
