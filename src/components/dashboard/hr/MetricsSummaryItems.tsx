import Icon from "../../../shared/Icon";

interface MetricsSummaryItemsProps {
  title: string;
  prefix: string;
  isPercentage: boolean;
  score: number | null; // Безпечно приймаємо null з бекенду
  trend: number | null; // Безпечно приймаємо null з бекенду
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
  // ФІКС: Якщо прилетів null (даних немає), примусово ставимо 0
  const safeScore = score ?? 0;
  const safeTrend = trend ?? 0;

  const isNegativeMetric =
    title.includes("Risk") ||
    title.includes("Ризик") ||
    title.includes("стресу") ||
    title.includes("Перевантаженість");

  const isInvert =
    title === "Ризик конфлікту" ||
    title === "Ризик вигорання" ||
    title.includes("стресу") ||
    title.includes("Перевантаженість");

  // --- ОБРОБКА ТРЕНДУ ---
  const isGoodTrend = isNegativeMetric ? safeTrend < 0 : safeTrend > 0;

  // Якщо тренд рівно 0 (або став 0 через відсутність даних), робимо нейтральну сіру плашку
  const trendClass =
    safeTrend === 0
      ? "bg-gray-50 border border-gray-200 text-gray-500"
      : isGoodTrend
        ? "bg-green-50 border border-green-200 text-green-700"
        : "bg-red-50 border border-red-200 text-red-700";

  const iconId = safeTrend < 0 ? "caret-down-filled" : "caret-up-filled";

  const formattedTrend = Math.abs(safeTrend).toFixed(1).replace(".", ",");
  const trendDisplayValue =
    safeTrend > 0
      ? `+${formattedTrend}`
      : safeTrend < 0
        ? `-${formattedTrend}`
        : "0,0";

  // --- ОБРОБКА СКОРУ ---
  let scoreClass;
  if (isInvert) {
    scoreClass = safeScore > 5 ? "text-error" : "text-success";
  } else if (isPercentage) {
    scoreClass = safeScore > 50 ? "text-success" : "text-error";
  } else {
    scoreClass = safeScore > 5 ? "text-success" : "text-error";
  }

  const formattedScore = safeScore.toFixed(1).replace(".", ",");

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px] h-full w-full transition-all hover:shadow-md">
      <div className="flex flex-col justify-between h-12 items-start gap-2 w-full">
        <span className="text-[15px] md:text-[16px] lg:text-[17px] text-grayscale-900 font-second-family font-light leading-tight">
          {title}
        </span>

        {title !== "Індекс анонімності" && title !== "Перевантаженість" && (
          <span
            className={`flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded-lg shrink-0 min-w-[64px] self-end ${trendClass}`}
          >
            {safeTrend !== 0 && <Icon id={iconId} className="w-3 h-3" />}
            <span className="text-xs font-semibold">{trendDisplayValue}</span>
          </span>
        )}
      </div>

      <div className="flex items-center justify-center my-3 grow">
        <span className={`text-3xl md:text-4xl font-bold ${scoreClass}`}>
          {formattedScore}
          {isPercentage ? (
            "%"
          ) : (
            <span className="text-grayscale-700 text-lg font-normal">/10</span>
          )}
        </span>
      </div>

      <div
        className="text-xs text-grayscale-700 text-center font-normal truncate w-full"
        title={`${prefix} ${worstTeam}`}
      >
        {prefix}{" "}
        <span className="text-grayscale-900 font-medium">{worstTeam}</span>
      </div>
    </div>
  );
};
