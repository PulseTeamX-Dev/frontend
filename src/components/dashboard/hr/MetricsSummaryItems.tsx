import Icon from "@/shared/ui/Icon";
import { formatNumber } from "@/shared/lib/formatNumber"; // <-- Замінили інлайн логіку на утиліту

interface MetricsSummaryItemsProps {
  title: string;
  prefix: string;
  isPercentage: boolean;
  score: number | null;
  trend: number | null;
  worstTeam: string;
}

export const MetricsSummaryItems = ({
  title,
  prefix,
  isPercentage,
  score,
  trend,
  worstTeam,
}: MetricsSummaryItemsProps) => {
  const safeScore = score ?? 0;
  const safeTrend = trend ?? 0;

  const isNegativeMetric =
    title.includes("Risk") ||
    title.includes("Ризик") ||
    title.includes("stress_index") ||
    title.includes("навантаження");

  const isInvert =
    title === "Ризик конфлікту" ||
    title === "Ризик вигорання" ||
    title.includes("стресу") ||
    title.includes("Перевантаження");

  const isGoodTrend = isNegativeMetric ? safeTrend < 0 : safeTrend > 0;

  const trendClass =
    safeTrend === 0
      ? "bg-gray-50 border border-gray-200 text-gray-500"
      : isGoodTrend
        ? "bg-green-50 border border-green-100 text-green-700"
        : "bg-red-50 border border-red-100 text-red-700";

  const iconId = safeTrend < 0 ? "caret-down-filled" : "caret-up-filled";

  const trendDisplayValue =
    safeTrend > 0
      ? `+${formatNumber(safeTrend)}`
      : safeTrend < 0
        ? `${formatNumber(safeTrend)}`
        : "0,0";

  let scoreClass;
  if (isInvert) {
    scoreClass = safeScore > 5 ? "text-error" : "text-success";
  } else if (isPercentage) {
    scoreClass = safeScore > 50 ? "text-success" : "text-error";
  } else {
    scoreClass = safeScore > 5 ? "text-success" : "text-error";
  }

  // 🛠️ ФІКС: Визначаємо контент для третього рядка залежно від заголовка
  const isActivity = title === "Активність";
  const isAnonymity = title === "Індекс анонімності";

  const renderFooter = () => {
    if (isActivity) {
      return <span>Середня по компанії</span>;
    }
    if (isAnonymity) {
      return <span>Відгуки з коментарями</span>;
    }
    return (
      <>
        {prefix}{" "}
        <span className="text-grayscale-900 font-medium">{worstTeam}</span>
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[150px] h-full w-full transition-all hover:shadow-md">
      {/* 🛠️ РЯДОК 1: Число (зліва) та Бадж тренду (справа) */}
      <div className="flex justify-between items-start w-full shrink-0 h-8">
        <span className={`text-[24px] font-bold ${scoreClass}`}>
          {formatNumber(safeScore)}
          {isPercentage ? (
            "%"
          ) : (
            <span className="text-grayscale-700 text-[16px] font-normal">
              /10
            </span>
          )}
        </span>

        {title !== "Індекс анонімності" && title !== "Перевантаження" && (
          <span
            className={`flex items-center justify-center gap-0.5 px-1.5 py-0.5 h-full rounded-lg text-[12px] shrink-0 min-w-[64px] ${trendClass}`}
          >
            {safeTrend !== 0 && <Icon id={iconId} className="w-3 h-3" />}
            <span className="text-xs font-semibold">{trendDisplayValue}</span>
          </span>
        )}
      </div>

      {/* 🛠️ РЯДОК 2: Назва метрики посередині з вирівнюванням ліворуч */}
      <div className="my-2 text-left w-full">
        <span className="text-[16px] text-grayscale-900 leading-tight block">
          {title}
        </span>
      </div>

      <div
        className="text-[14px] text-grayscale-700 text-left font-normal truncate w-full"
        title={
          isActivity
            ? "Середня по компанії"
            : isAnonymity
              ? "Відгуки з коментарями"
              : `${prefix} ${worstTeam}`
        }
      >
        {renderFooter()}
      </div>
    </div>
  );
};
