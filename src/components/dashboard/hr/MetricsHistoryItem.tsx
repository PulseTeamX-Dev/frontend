import Icon from "@/shared/ui/Icon";
import { getHeatmapClass } from "../../../utils/getLevel";

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
          <Icon id="lock" className="w-6 h-6 text-grayscale-800" />
        ) : (
          <Icon id="face-sad" className="w-6 h-6 text-grayscale-800" />
        )}
      </div>
    );
  }

  const isRiskMetric =
    metricKey === "stress_index" || metricKey === "workload_strain_index";

  const bgColor = getHeatmapClass(value, isRiskMetric);

  return (
    <div
      className={`w-full h-full min-h-[56px] rounded-xl flex items-center justify-center  text-grayscale-900 text-[14px] md:text-[16px] ${bgColor}`}
    >
      {value.toFixed(1).replace(".", ",")}
    </div>
  );
};

export default MetricsHistoryItem;
