import { Title } from "../../../shared/Title";

export interface EnhancedWorkloadData {
  team_name: string;
  workload_strain_index: number;
  workload_min: number;
  workload_max: number;
  workload_status: string;
  overload_count?: number;
  underload_count?: number;
  response_count?: number;
}

interface WorkloadChartProps {
  data: EnhancedWorkloadData[];
}

export const WorkloadChart = ({ data }: WorkloadChartProps) => {
  // ФІКС: Замінили стандартні класи Tailwind на кастомні HEX-кольори (#DC2626) для максимального контрасту
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
          {/* Мікро-заголовок шкали з точним позиціонуванням за зонами 30/40/30 */}
          <div className="hidden sm:flex items-center gap-3 w-full text-[10px] md:text-[11px] font-medium text-gray-400 mb-2 shrink-0 pb-2 border-b border-gray-50">
            {/* Назва команди зліва */}
            <div className="w-[60px] md:w-[85px] shrink-0"></div>

            {/* Центральна шкала */}
            <div className="grow flex w-full tracking-tight">
              <span className="w-[30%] text-left pl-1">
                &lt;4 <span className="hidden lg:inline">Неповна</span>
              </span>
              <span className="w-[40%] text-center">
                4-7 <span className="hidden lg:inline">Оптимально</span>
              </span>
              {/* Зміна ТЗ: "Перенавантаження" замінено на "Перевантаження" */}
              <span className="w-[30%] text-right pr-1">
                7&gt; <span className="hidden lg:inline">Зона ризику</span>
              </span>
            </div>

            {/* Порожній симетричний контейнер-заглушка замість захардкоджених 150px */}
            <div className="w-[65px] md:w-[110px] shrink-0"></div>
          </div>

          {/* Скрол-контейнер для списку команд */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 md:gap-5 mt-1 custom-scrollbar w-full">
            {data.map((team, index) => {
              const leftPosition = getPercent(team.workload_min);
              const rightPosition = getPercent(team.workload_max);
              const pillWidth = Math.max(1, rightPosition - leftPosition);

              const teamColor = getStatusColor(team.workload_status);
              const textColor = getStatusColor(team.workload_status, true);

              const strainPct = Math.round(
                (team.workload_strain_index || 0) * 10,
              );

              // Зміна ТЗ: Замість загальних Перенавантажень виводимо чітке "перев."
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
                  className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 w-full pb-3 sm:pb-0 border-b border-gray-50/50 sm:border-none last:border-none"
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

                  {/* ДЕСКТОП СТАН: Ліва назва команди */}
                  <div
                    className="hidden sm:block w-[60px] md:w-[85px] shrink-0 text-[13px] md:text-sm font-medium text-gray-900 truncate"
                    title={team.team_name}
                  >
                    {team.team_name}
                  </div>

                  {/* ЦЕНТР: Спред */}
                  <div className="grow relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex opacity-40">
                      <div className="w-[30%] h-full bg-blue-100 border-r border-white/50"></div>
                      <div className="w-[40%] h-full bg-green-100 border-r border-white/50"></div>
                      <div className="w-[30%] h-full bg-red-100"></div>
                    </div>

                    <div
                      className={`absolute h-full rounded-full shadow-sm ${teamColor} z-10`}
                      style={{
                        left: `${leftPosition}%`,
                        width: `${pillWidth}%`,
                      }}
                    >
                      {/* ФІКС ТУЛТІПУ 1: Додано title для вертикальної риски медіани */}
                      <div
                        className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-[70%] bg-white/90 rounded-full cursor-help"
                        title={`Середнє навантаження по команді: ${team.workload_strain_index.toFixed(1).replace(".", ",")}`}
                      ></div>
                    </div>
                  </div>

                  <div className="hidden sm:block w-[65px] md:w-[110px] shrink-0 text-right text-[11px] md:text-xs leading-tight whitespace-nowrap">
                    <span
                      className={`font-bold ${textColor} text-[13px] md:text-sm cursor-help`}
                      title="Індекс деструктивного навантаження (% людей в зоні ризику ≥8 або ≤3)"
                    >
                      {strainPct}%
                    </span>
                    {/* ФІКС ДЕТАЛЕЙ 3: Динамічно вбудовуємо назву поточної команди в мобільний і десктопний футер опису рядка */}
                    <span
                      className="text-gray-500 ml-1 text-[10px] md:text-[11px] cursor-default"
                      title={`${strainPct}% команди ${team.team_name} в деструктивній зоні`}
                    >
                      {details}
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
