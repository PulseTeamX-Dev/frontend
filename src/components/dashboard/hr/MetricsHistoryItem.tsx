import Icon from "../../../shared/Icon";

interface MetricsHistoryItemProps {
  value: number | null | undefined;
  metricKey: string;
  isCurrentWeek: boolean; // Отримуємо з батьківського компонента
}

const MetricsHistoryItem = ({
  value,
  metricKey,
  isCurrentWeek,
}: MetricsHistoryItemProps) => {
  // 2. Логіка пустих станів
  if (value === null || value === undefined) {
    return (
      <div className="h-14 md:h-16 rounded-xl bg-grayscale-200 flex items-center justify-center opacity-50">
        {isCurrentWeek ? (
          // Замочок для поточного тижня (ще не назбирали 5 відповідей)
          <Icon id="lock" className="w-6 h-6 text-grayscale-700" />
        ) : (
          // Сумний смайлик для минулих тижнів (опитування проігнороване)
          <Icon id="face-sad" className="w-6 h-6 text-grayscale-700" />
        )}
      </div>
    );
  }

  // Визначаємо, які метрики є "ризиковими" (чим більше - тим гірше)
  const isRiskMetric =
    metricKey === "stress_index" || metricKey === "workload_strain_index";

  const getLevel = () => {
    if (isRiskMetric) {
      if (value < 4) return "low"; // Зелений
      if (value < 7) return "medium"; // Жовтий
      return "high"; // Червоний
    }
    // Для позитивних метрик (Довіра, Ясність) - все навпаки
    if (value > 7) return "low"; // Зелений
    if (value > 5) return "medium"; // Жовтий
    return "high"; // Червоний
  };

  const level = getLevel();

  const styles: Record<string, string> = {
    low: "bg-green-100 text-[#10b981]",
    medium: "bg-yellow-200 text-[#d97706]",
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
