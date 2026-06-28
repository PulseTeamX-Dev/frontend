import { Title } from "../../../shared/Title";

export interface EnhancedWorkloadData {
  team_name: string;
  workload_strain_index: number;
  workload_min: number;
  workload_max: number;
  workload_status: string;
  workload_avg: number;
  overload_count?: number;
  underload_count?: number;
  response_count?: number;
}

interface WorkloadChartProps {
  data: EnhancedWorkloadData[];
}

export const WorkloadChart = ({ data }: WorkloadChartProps) => {
  const getStatusColor = (status: string, isText = false) => {
    switch (status) {
      case "Overload":
        return isText ? "text-error" : "bg-error";
      case "Underload":
        return isText ? "text-blue-900" : "bg-blue-900";
      case "Polarized":
        return isText ? "text-orange-900" : "bg-orange-900";
      case "Optimal":
      default:
        return isText ? "text-success" : "bg-success";
    }
  };

  const getPercent = (score: number) => {
    const s = Math.max(1, Math.min(10, score));
    if (s < 4) return ((s - 1) / 3) * 30;
    if (s <= 7) return 30 + ((s - 4) / 3) * 40;
    return 70 + ((s - 7) / 3) * 30;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full flex-1 flex flex-col min-h-0">
      <Title
        tag="h2"
        variant="light"
        className="mb-3 shrink-0 text-[15px] md:text-base"
      >
        Навантаженість
      </Title>

      {data.length === 0 ? (
        <div className="grow flex items-center justify-center text-sm text-gray-400">
          Немає даних
        </div>
      ) : (
        <div className="flex-1 flex flex-col w-full min-h-0">
          <div className="hidden sm:grid grid-cols-[110px_1fr_auto] items-center gap-3 w-full text-[11px] font-medium text-gray-400 mb-4 shrink-0 pb-2 border-b border-gray-50">
            <div></div>
            <div className="grid grid-cols-3 text-center tracking-tight font-semibold text-grayscale-700 leading-tight">
              <div className="flex flex-col items-start pl-2">
                <span>&lt;4</span>
                <span className="text-[10px] font-normal text-grayscale-700 mt-0.5">
                  Неповна
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span>4-7</span>
                <span className="text-[10px] font-normal text-grayscale-700 mt-0.5">
                  Оптимальна
                </span>
              </div>
              <div className="flex flex-col items-end pr-2">
                <span>7&gt;</span>
                <span className="text-[10px] font-normal text-grayscale-700 mt-0.5">
                  Зона ризику
                </span>
              </div>
            </div>
            <div className="w-16 text-right font-semibold text-grayscale-700 pl-4"></div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-4 sm:gap-5 mt-1 pb-2 custom-scrollbar w-full min-h-0">
            {data.map((team, index) => {
              const leftPosition = getPercent(team.workload_min);
              const rightPosition = getPercent(team.workload_max);
              const pillWidth = Math.max(1, rightPosition - leftPosition);

              const teamColor = getStatusColor(team.workload_status);

              const range = team.workload_max - team.workload_min;
              const lineLeftPct =
                range > 0
                  ? Math.min(
                      100,
                      Math.max(
                        0,
                        ((team.workload_avg - team.workload_min) / range) * 100,
                      ),
                    )
                  : 50;

              const formattedAvg = (team.workload_avg || 0)
                .toFixed(1)
                .replace(".", ",");

              // 🛠️ Форматуємо min та max для відображення
              const formattedMin = (team.workload_min || 0)
                .toFixed(1)
                .replace(".", ",");
              const formattedMax = (team.workload_max || 0)
                .toFixed(1)
                .replace(".", ",");

              // Показуємо значення по краях, тільки якщо плашка достатньо широка
              const showMinMaxLabels = pillWidth > 15;

              const strainPct = Math.round(
                (team.workload_strain_index || 0) * 10,
              );

              let details = "";
              if (team.overload_count && team.underload_count) {
                details = `(${team.overload_count} >, ${team.underload_count} <)`;
              } else if (team.overload_count) {
                details = `(${team.overload_count} >)`;
              } else if (team.underload_count) {
                details = `(${team.underload_count} <)`;
              }

              const isLastItem = index === data.length - 1 && data.length > 2;
              const centerTooltipYClass = isLastItem
                ? "bottom-full mb-2"
                : "top-full mt-2";
              const centerTooltipArrowClass = isLastItem
                ? "top-full border-t-grayscale-900"
                : "bottom-full border-b-grayscale-900";

              const isTopTwoItems = index < 2;
              const rightTooltipYClass = isTopTwoItems
                ? "top-full mt-2.5"
                : "bottom-full mb-2.5";
              const rightTooltipArrowClass = isTopTwoItems
                ? "bottom-full border-b-grayscale-900"
                : "top-full border-t-grayscale-900";

              return (
                <div
                  key={`${team.team_name}_${index}`}
                  className="w-full flex flex-col sm:grid sm:grid-cols-[110px_1fr_auto] sm:items-center gap-2 sm:gap-3 pb-3 sm:pb-0 border-b border-gray-50/50 sm:border-none last:border-none relative py-0.5"
                >
                  <div className="flex justify-between items-center sm:block w-full min-w-0">
                    <span className="text-[14px] md:text-[15px] text-grayscale-800 font-medium truncate block pr-2">
                      {team.team_name}
                    </span>
                    <div className="text-[11px] whitespace-nowrap text-right flex items-baseline justify-end gap-1 sm:hidden">
                      <span className="font-bold text-grayscale-700 text-[13px]">
                        {strainPct}%
                      </span>
                      {details && (
                        <span className="text-gray-400 font-medium">
                          {details}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative h-11 bg-white border border-gray-200 rounded-lg w-full p-1 select-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
                    <div className="absolute inset-0 flex pointer-events-none rounded-lg overflow-hidden p-1">
                      <div className="w-[30%] h-full border-r border-gray-100"></div>
                      <div className="w-[40%] h-full border-r border-gray-100"></div>
                      <div className="w-[30%] h-full"></div>
                    </div>

                    <div
                      className={`absolute h-[calc(100%-8px)] rounded-md shadow-sm ${teamColor} transition-all duration-300 group cursor-help`}
                      style={{
                        left: `calc(${leftPosition}% + 4px)`,
                        width: `calc(${pillWidth}% - 8px)`,
                      }}
                    >
                      {/* 🛠️ Додані значення MIN та MAX всередині плашки */}
                      {showMinMaxLabels && (
                        <>
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] md:text-[11px] font-bold text-white/90 z-10 pointer-events-none">
                            {formattedMin}
                          </span>
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] md:text-[11px] font-bold text-white/90 z-10 pointer-events-none">
                            {formattedMax}
                          </span>
                        </>
                      )}

                      <div
                        style={{ left: `${lineLeftPct}%` }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm z-20"
                      ></div>

                      <div
                        className={`absolute left-1/2 -translate-x-1/2 hidden group-hover:block bg-grayscale-900 text-white text-[11px] px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap z-[99] animate-in fade-in ${centerTooltipYClass}`}
                      >
                        {team.workload_status}{" "}
                        <span className="font-bold">{formattedAvg}</span>
                        <div
                          className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${centerTooltipArrowClass}`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-start justify-center text-[13px] md:text-sm whitespace-nowrap relative w-16 min-w-[64px] pr-1 pl-4">
                    <span className="relative group font-bold tracking-tight block">
                      <span className="text-grayscale-700 cursor-help font-semibold text-[14px]">
                        {strainPct}%
                      </span>
                      <div
                        className={`absolute right-0 hidden group-hover:block bg-grayscale-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-[99] font-normal animate-in fade-in ${rightTooltipYClass}`}
                      >
                        Індекс деструктивного навантаження
                        <br />
                        <span className="text-gray-400">
                          (% людей в зоні ризику ≥8 або ≤3)
                        </span>
                        <div
                          className={`absolute right-3 border-4 border-transparent ${rightTooltipArrowClass}`}
                        ></div>
                      </div>
                    </span>

                    {details && (
                      <span className="relative group text-gray-400 font-medium text-xs cursor-default mt-0.5 block">
                        {details}
                        <div
                          className={`absolute right-0 hidden group-hover:block bg-grayscale-900 text-white text-[11px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-[99] font-normal animate-in fade-in ${rightTooltipYClass}`}
                        >
                          <span className="font-bold">{strainPct}%</span>{" "}
                          команди{" "}
                          <span className="font-semibold text-primary-hover">
                            {team.team_name}
                          </span>{" "}
                          в зоні ризику
                          <div
                            className={`absolute right-4 border-4 border-transparent ${rightTooltipArrowClass}`}
                          ></div>
                        </div>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
