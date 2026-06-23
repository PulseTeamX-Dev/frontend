import Icon from "../../../shared/Icon";
import { Title } from "../../../shared/Title";
import type { HeatmapItem } from "../../../types/dashboard/types";
import { getLevel } from "../../../utils/getLevel";

interface TLMetricsHistoryProps {
  heatmapData: HeatmapItem[];
}

export const MetricsHistory = ({ heatmapData }: TLMetricsHistoryProps) => {
  const sortedWeeks = [...heatmapData]
    .sort(
      (a, b) =>
        new Date(a.week_start).getTime() - new Date(b.week_start).getTime(),
    )
    .slice(-6);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getCellStyles = (metricKey: string, value: number) => {
    const isRiskMetric =
      metricKey === "stress_index" ||
      metricKey === "workload_strain_index" ||
      metricKey === "conflict_risk" ||
      metricKey === "burnout_risk_index";

    const level = getLevel(value, isRiskMetric);

    const styles: Record<string, string> = {
      low: "bg-green-100 text-[#10b981]",
      medium: "bg-yellow-200 text-[#d97706]",
      high: "bg-red-600 text-white",
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full h-full flex flex-col justify-between">
      <Title tag="h2" variant="light">
        Динамічний тепловий профіль команди
      </Title>

      <div className="overflow-x-auto w-full custom-scrollbar pb-2">
        <table className="w-full border-collapse">
          <tbody>
            {metricsRows.map((row) => (
              <tr key={row.key} className="border-none">
                <td className="text-xs md:text-sm font-normal text-gray-400 text-right pr-4 py-2 w-32 md:w-40 whitespace-nowrap">
                  {row.label}
                </td>

                {sortedWeeks.map((week, index) => {
                  const val = week[row.key as keyof HeatmapItem];
                  const isCurrentWeek = index === sortedWeeks.length - 1;

                  if (val === null || val === undefined) {
                    return (
                      <td
                        key={`${row.key}_${week.week_start}`}
                        className="p-1 md:p-1.5"
                      >
                        <div className="w-full py-4 md:py-5 rounded-xl bg-gray-100 flex items-center justify-center opacity-60 min-w-[56px]">
                          <Icon
                            id={isCurrentWeek ? "lock" : "face-sad"}
                            className="w-5 h-5 text-gray-400"
                          />
                        </div>
                      </td>
                    );
                  }

                  const numericValue = typeof val === "number" ? val : 0;
                  return (
                    <td
                      key={`${row.key}_${week.week_start}`}
                      className="p-1 md:p-1.5"
                    >
                      <div
                        className={`w-full py-4 md:py-5 rounded-xl text-center text-sm md:text-base font-semibold tracking-tight transition-all min-w-[56px] ${getCellStyles(
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
