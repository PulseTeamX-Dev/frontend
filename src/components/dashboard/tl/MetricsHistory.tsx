import { Title } from "../../../shared/Title";
import type { HeatmapItem } from "../../../types/dashboard/types";

interface TLMetricsHistoryProps {
  heatmapData: HeatmapItem[];
}

export const MetricsHistory = ({ heatmapData }: TLMetricsHistoryProps) => {
  // 1. Сортуємо тижні за зростанням (від старіших до новіших)
  const sortedWeeks = [...heatmapData].sort(
    (a, b) =>
      new Date(a.week_start).getTime() - new Date(b.week_start).getTime(),
  );

  // Helper для форматування дати (наприклад, "01.05")
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  // ПЕРЕВИКОРИСТАНА ЛОГІКА СТИЛІЗАЦІЇ З HR-ХІТМЕПУ
  const getCellStyles = (metricKey: string, value: number) => {
    // Визначаємо, які метрики є "ризиковими" (чим більше - тим гірше)
    // Додали сюди conflict та burnout, щоб покрити всі серверні інверсні метрики
    const isRiskMetric =
      metricKey === "stress_index" ||
      metricKey === "workload_strain_index" ||
      metricKey === "conflict_risk" ||
      metricKey === "burnout_risk_index";

    const getLevel = () => {
      if (isRiskMetric) {
        if (value < 4) return "low"; // Зелений
        if (value < 7) return "medium"; // Жовтий
        return "high"; // Червоний
      }
      // Для позитивних метрик (Довіра, Ясність, Безпека) - все навпаки
      if (value >= 7) return "low"; // Зелений
      if (value >= 5) return "medium"; // Жовтий
      return "high"; // Червоний
    };

    const level = getLevel();

    // Повернули фірмові пастельні кольори дизайнерів + покраску тексту під кожен рівень
    const styles: Record<string, string> = {
      low: "bg-green-100 text-[#10b981]", // Зелений фон + Зелений текст
      medium: "bg-yellow-200 text-[#d97706]", // Жовтий фон + Жовтий текст
      high: "bg-red-500 text-white", // Червоний фон + Червоний текст
    };

    return styles[level];
  };

  const metricsRows = [
    { label: "Індекс стресу", key: "stress_index" },
    { label: "Рівень довіри", key: "trust_index" },
    { label: "Ясність завдань", key: "clarity_index" },
    { label: "Психологічна безпека", key: "psychological_safety_index" },
    { label: "Ризик вигорання", key: "burnout_risk_index" },
    { label: "Ризик конфліктів", key: "conflict_risk" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full flex flex-col justify-between">
      <Title tag="h2" variant="light">
        Динамічний тепловий профіль команди
      </Title>

      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <tbody>
            {metricsRows.map((row) => (
              <tr key={row.key} className="border-none">
                {/* Назва метрики зліва */}
                <td className="text-xs md:text-sm font-normal text-gray-400 text-right pr-4 py-2 w-32 md:w-40 whitespace-nowrap">
                  {row.label}
                </td>

                {/* Великі, витягнуті картки значень */}
                {sortedWeeks.map((week) => {
                  const val = week[row.key as keyof HeatmapItem];
                  const numericValue = typeof val === "number" ? val : 0;

                  return (
                    <td
                      key={`${row.key}_${week.week_start}`}
                      className="p-1 md:p-1.5"
                    >
                      {/* Сюди тепер прилітають готові класи фону та кольору тексту */}
                      <div
                        className={`w-full py-4 md:py-5 rounded-xl text-center text-sm md:text-base font-semibold tracking-tight transition-all ${getCellStyles(
                          row.key,
                          numericValue,
                        )}`}
                      >
                        {numericValue.toFixed(1).replace(".", ",")}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

          {/* Надійний підпис дат знизу */}
          <tfoot>
            <tr className="border-none">
              <td className="py-2"></td>
              {sortedWeeks.map((week) => (
                <td
                  key={`tfoot_date_${week.week_start}`}
                  className="p-1 md:p-1.5 text-center text-xs text-gray-400 font-normal pt-4"
                >
                  {formatDate(week.week_start)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
