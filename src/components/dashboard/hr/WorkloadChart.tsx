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
        return isText ? "text-[#DC2626]" : "bg-[#DC2626]";
      case "Underload":
        return isText ? "text-blue-500" : "bg-blue-500";
      case "Polarized":
        return isText ? "text-orange-500" : "bg-orange-500";
      case "Optimal":
      default:
        return isText ? "text-green-500" : "bg-green-500";
    }
  };

  const getPercent = (score: number) => {
    const s = Math.max(1, Math.min(10, score));
    if (s < 4) return ((s - 1) / 3) * 30;
    if (s <= 7) return 30 + ((s - 4) / 3) * 40;
    return 70 + ((s - 7) / 3) * 30;
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 w-full flex-1 flex flex-col min-h-0">
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
        <div className="flex-1 flex flex-col min-h-0 w-full">
          <div className="hidden sm:flex items-center gap-3 w-full text-[10px] md:text-[11px] font-medium text-gray-400 mb-2 shrink-0 pb-2 border-b border-gray-50">
            <div className="w-[60px] md:w-[85px] shrink-0"></div>
            <div className="grow flex w-full tracking-tight">
              <span className="w-[30%] text-left pl-1">&lt;4 Неповна</span>
              <span className="w-[40%] text-center">4-7 Оптимально</span>
              <span className="w-[30%] text-right pr-1">7&gt; Зона ризику</span>
            </div>
            <div className="w-[65px] md:w-[110px] shrink-0 text-right">
              Зона ризику
            </div>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4 md:gap-5 mt-1 custom-scrollbar w-full">
            {data.map((team, index) => {
              const leftPosition = getPercent(team.workload_min);
              const rightPosition = getPercent(team.workload_max);
              const pillWidth = Math.max(1, rightPosition - leftPosition);

              const teamColor = getStatusColor(team.workload_status);
              const textColor = getStatusColor(team.workload_status, true);

              const range = team.workload_max - team.workload_min;

              // Розрахунок плаваючої координати X
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

              // Виводимо workload_avg з бази
              const formattedAvg = (team.workload_avg || 0)
                .toFixed(1)
                .replace(".", ",");
              const strainPct = Math.round(
                (team.workload_strain_index || 0) * 10,
              );

              let details = "(оптимально)";
              if (team.overload_count && team.underload_count) {
                details = `(${team.overload_count} перев., ${team.underload_count} недов.)`;
              } else if (team.overload_count) {
                details = `(${team.overload_count} перев.)`;
              } else if (team.underload_count) {
                details = `(${team.underload_count} недов.)`;
              }

              return (
                <div
                  key={`${team.team_name}_${index}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 w-full pb-3 sm:pb-0 border-b border-gray-50/50 sm:border-none last:border-none relative"
                >
                  {/* МОБІЛЬНИЙ СТАН */}
                  <div className="flex justify-between items-center sm:hidden w-full mb-0.5">
                    <span className="text-[13px] font-semibold text-gray-900 truncate max-w-[60%]">
                      {team.team_name}
                    </span>
                    <div className="text-[11px] whitespace-nowrap text-right">
                      <span className={`font-bold ${textColor} text-[13px]`}>
                        {strainPct}%{" "}
                      </span>
                      <span className="text-gray-400 font-medium">
                        {details}
                      </span>
                    </div>
                  </div>

                  {/* ДЕСКТОП СТАН */}
                  <div className="hidden sm:block w-[60px] md:w-[85px] shrink-0 text-[13px] md:text-sm font-medium text-gray-900 truncate">
                    {team.team_name}
                  </div>

                  <div className="grow relative h-3 bg-gray-100 rounded-full flex items-center w-full">
                    <div className="absolute inset-0 flex opacity-40 rounded-full overflow-hidden">
                      <div className="w-[30%] h-full bg-blue-100 border-r border-white/50"></div>
                      <div className="w-[40%] h-full bg-green-100 border-r border-white/50"></div>
                      <div className="w-[30%] h-full bg-red-100"></div>
                    </div>

                    <div
                      className={`absolute h-full rounded-full shadow-sm ${teamColor} z-10 group`}
                      style={{
                        left: `${leftPosition}%`,
                        width: `${pillWidth}%`,
                      }}
                    >
                      <div className="absolute -inset-y-2 -inset-x-2 cursor-help bg-transparent z-10"></div>

                      {/* Математично точна риска */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-[70%] bg-white/90 rounded-full z-20 transition-all duration-300"
                        style={{ left: `${lineLeftPct}%` }}
                      ></div>

                      {/* ТУЛТІП ЗНИЗУ З РЕАЛЬНИМ workload_avg */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-grayscale-900 text-white text-[11px] px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none animate-in fade-in slide-in-from-top-1">
                        Середнє значення:{" "}
                        <span className="font-bold">{formattedAvg}</span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-grayscale-900"></div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block w-[65px] md:w-[110px] shrink-0 text-right text-[11px] md:text-xs leading-tight whitespace-nowrap overflow-visible">
                    <span className="relative inline-block group">
                      <span
                        className={`font-bold ${textColor} text-[13px] md:text-sm cursor-help`}
                      >
                        {strainPct}%
                      </span>
                      <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-grayscale-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none font-normal animate-in fade-in slide-in-from-top-1">
                        Індекс деструктивного навантаження
                        <br />
                        <span className="text-grayscale-400">
                          (% людей в зоні ризику ≥8 або ≤3)
                        </span>
                        <div className="absolute bottom-full right-3 border-4 border-transparent border-b-grayscale-900"></div>
                      </div>
                    </span>
                    <span className="relative inline-block group ml-1">
                      <span className="text-gray-500 cursor-default">
                        {details}
                      </span>
                      <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-grayscale-900 text-white text-[11px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-50 pointer-events-none font-normal animate-in fade-in slide-in-from-top-1">
                        <span className="font-bold">{strainPct}%</span> команди{" "}
                        <span className="font-semibold text-primary-hover">
                          {team.team_name}
                        </span>{" "}
                        в зоні ризику
                        <div className="absolute bottom-full right-4 border-4 border-transparent border-b-grayscale-900"></div>
                      </div>
                    </span>
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
