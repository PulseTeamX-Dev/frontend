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

  // Helper для кольору комірки строго за бізнес-моделлю та палітрою макета
  const getCellBg = (metricName: string, value: number) => {
    const isInverse =
      metricName === "stress" ||
      metricName === "conflict" ||
      metricName === "burnout";

    if (isInverse) {
      if (value < 4) return "bg-[#e8f7ee] text-[#10b981]";
      if (value < 7) return "bg-[#fef3c7] text-[#d97706]";
      return "bg-[#fee2e2] text-[#ef4444]";
    } else {
      if (value >= 7) return "bg-[#e8f7ee] text-[#10b981]";
      if (value >= 5) return "bg-[#fef3c7] text-[#d97706]";
      return "bg-[#fee2e2] text-[#ef4444]";
    }
  };

  const metricsRows = [
    { label: "Індекс стресу", key: "stress_index", name: "stress" },
    { label: "Рівень довіри", key: "trust_index", name: "trust" },
    { label: "Ясність завдань", key: "clarity_index", name: "clarity" },
    {
      label: "Психологічна безпека",
      key: "psychological_safety_index",
      name: "safety",
    },
    { label: "Ризик вигорання", key: "burnout_risk_index", name: "burnout" },
    { label: "Risk конфліктів", key: "conflict_risk", name: "conflict" },
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
                      <div
                        className={`w-full py-4 md:py-5 rounded-xl text-center text-sm md:text-base font-semibold tracking-tight transition-all ${getCellBg(
                          row.name,
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

          {/* НАДІЙНИЙ ФІКС ДАТ: Тепер жодних дивів у tr, тільки чисті td */}
          <tfoot>
            <tr className="border-none">
              {/* Пуста нижня ліва комірка для назв */}
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
