import Icon from "../../../shared/Icon";

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

  // ФІКС: Оновили ключове слово на "Перевантаження"
  const isNegativeMetric =
    title.includes("Risk") ||
    title.includes("Ризик") ||
    title.includes("стресу") ||
    title.includes("Перевантаження");

  const isInvert =
    title === "Ризик конфлікту" ||
    title === "Ризик вигорання" ||
    title.includes("стресу") ||
    title.includes("Перевантаження");

  // --- ОБРОБКА ТРЕНДУ ---
  const isGoodTrend = isNegativeMetric ? safeTrend < 0 : safeTrend > 0;

  const trendClass =
    safeTrend === 0
      ? "bg-gray-50 border border-gray-200 text-gray-500"
      : isGoodTrend
        ? "bg-green-100 border border-green-300 text-green-700"
        : "bg-red-100 border border-red-300 text-red-700";

  const iconId = safeTrend < 0 ? "caret-down-filled" : "caret-up-filled";

  const formattedTrend = Math.abs(safeTrend).toFixed(1).replace(".", ",");
  const trendDisplayValue =
    safeTrend > 0
      ? `+${formattedTrend}`
      : safeTrend < 0
        ? `-${formattedTrend}`
        : "0,0";

  // --- ОБРОБКА СКОРУ ---
  // ФІКС: Замінили "text-error" на насичений і контрастний "text-[#DC2626]"
  let scoreClass;
  if (isInvert) {
    scoreClass = safeScore > 5 ? "text-[#DC2626]" : "text-success";
  } else if (isPercentage) {
    scoreClass = safeScore > 50 ? "text-success" : "text-[#DC2626]";
  } else {
    scoreClass = safeScore > 5 ? "text-success" : "text-[#DC2626]";
  }

  const formattedScore = safeScore.toFixed(1).replace(".", ",");

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px] h-full w-full transition-all hover:shadow-md">
      <div className="flex flex-col justify-between h-12 items-start gap-2 w-full">
        <span className="text-[15px] md:text-[16px] lg:text-[17px] text-grayscale-900 font-second-family font-light leading-tight">
          {title}
        </span>

        {/* ФІКС: Оновили перевірку на нову назву "Перевантаження" */}
        {title !== "Індекс анонімності" && title !== "Перевантаження" && (
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
