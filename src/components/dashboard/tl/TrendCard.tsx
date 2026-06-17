import Icon from "../../../shared/Icon";
import { Title } from "../../../shared/Title";
import { formatTxt } from "../../../utils/formatTxt";

interface TrendCardProps {
  title: string;
  trend: number;
  isInverseMetric?: boolean; // Для стресу: чим більше, тим гірше
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
  // Визначаємо, чи хороший тренд
  const isGoodTrend = isInverseMetric ? trend < 0 : trend > 0;

  // Якщо метрика стресу росте (trend > 0) — це погано (червоний)
  const trendClass = isGoodTrend
    ? "bg-green-100 border border-green-300 text-green-700"
    : "bg-red-100 border border-red-300 text-red-700";

  // Логіка для стрілочки
  const iconId = trend < 0 ? "caret-down-filled" : "caret-up-filled";

  // Визначаємо критичний стан
  const isCritical = isInverseMetric
    ? trend >= criticalThreshold
    : trend <= criticalThreshold;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <Title tag="h2" variant="light">
        {title}
      </Title>
      <div className="flex items-center justify-center grow my-2">
        <div
          className={`flex items-center gap-1 rounded-xl px-3 py-2 text-base font-bold shadow-sm ${trendClass}`}
        >
          <Icon id={iconId} className="w-5 h-5" />
          <span>{formatTxt(trend)}</span>
        </div>
      </div>

      {/* Підпис знизу */}
      <div className="text-[11px] text-center font-normal text-gray-400">
        {isCritical ? criticalText : "Порівняно з минулим тижнем"}
      </div>
    </div>
  );
};
