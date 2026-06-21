import Icon from "../../../shared/Icon";
import { Title } from "../../../shared/Title";
import { formatTxt } from "../../../utils/formatTxt";

interface TrendCardProps {
  title: string;
  trend: number;
  isInverseMetric?: boolean;
  criticalText: string;
  criticalThreshold: number;
}

export const TrendCard = ({
  title,
  trend,
  isInverseMetric = false,
  criticalText,
  criticalThreshold,
}: TrendCardProps) => {
  const isGoodTrend = isInverseMetric ? trend < 0 : trend > 0;

  const trendClass = isGoodTrend
    ? "bg-green-100 border border-green-300 text-green-700"
    : "bg-red-100 border border-red-300 text-red-700";

  const iconId = trend < 0 ? "caret-down-filled" : "caret-up-filled";

  const isCritical = isInverseMetric
    ? trend >= criticalThreshold
    : trend <= criticalThreshold;

  return (
    // ФІКС: p-5 md:p-6 змінено на p-4 md:p-5
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full min-h-0">
      <Title tag="h2" variant="light" className="mb-1 text-[15px] md:text-base">
        {title}
      </Title>

      {/* ФІКС: my-2 змінено на my-1 */}
      <div className="flex items-center justify-center grow my-1">
        <div
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[15px] font-bold shadow-sm ${trendClass}`}
        >
          <Icon id={iconId} className="w-4 h-4" />
          <span>{formatTxt(trend)}</span>
        </div>
      </div>

      <div className="text-[10px] text-center font-normal text-gray-400 mt-1 leading-tight">
        {isCritical ? criticalText : "Порівняно з минулим тижнем"}
      </div>
    </div>
  );
};
