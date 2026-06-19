import { useState } from "react";
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const averageScore = data.length
    ? data.reduce((sum, item) => sum + item.workload_strain_index, 0) /
      data.length
    : 0;

  // ФІКС 1: Колір хедера тепер залежить виключно від БД (пріоритет у Overload)
  let dominantStatus = "Optimal";
  if (data.some((d) => d.workload_status === "Overload")) {
    dominantStatus = "Overload";
  } else if (data.some((d) => d.workload_status === "Underload")) {
    dominantStatus = "Underload";
  } else if (data.some((d) => d.workload_status === "Polarized")) {
    dominantStatus = "Polarized";
  }

  const getStatusColor = (status: string, isText = false) => {
    switch (status) {
      case "Overload":
        return isText ? "text-red-500" : "bg-red-500";
      case "Underload":
        return isText ? "text-blue-500" : "bg-blue-500";
      case "Polarized":
        return isText ? "text-orange-500" : "bg-orange-500";
      case "Optimal":
      default:
        return isText ? "text-green-500" : "bg-green-500";
    }
  };

  const headerColor = getStatusColor(dominantStatus, true);

  const getPercent = (score: number) => {
    const s = Math.max(1, Math.min(10, score));
    if (s < 4) return ((s - 1) / 3) * 30;
    if (s <= 7) return 30 + ((s - 4) / 3) * 40;
    return 70 + ((s - 7) / 3) * 30;
  };

  // Агрегація даних для динамічного футера
  const totalResponses = data.reduce(
    (sum, t) => sum + (t.response_count || 0),
    0,
  );
  const totalOverload = data.reduce(
    (sum, t) => sum + (t.overload_count || 0),
    0,
  );
  const totalUnderload = data.reduce(
    (sum, t) => sum + (t.underload_count || 0),
    0,
  );
  const riskPct = totalResponses
    ? Math.round(((totalOverload + totalUnderload) / totalResponses) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full h-full flex flex-col justify-between relative">
      <Title tag="h2" variant="light">
        Навантаженість
      </Title>

      <div className="grow flex flex-col justify-center mt-3">
        {/* Динамічний колір хедера */}
        <div className="text-center mb-4">
          <span
            className={`text-[32px] md:text-4xl font-bold ${headerColor} transition-colors duration-300`}
          >
            {averageScore.toFixed(1).replace(".", ",")}
          </span>
          <span className="text-gray-500 text-lg font-medium">/10</span>
        </div>

        <div className="relative w-full py-1">
          {/* Базовий фон шкали (сірий, тонкий) */}
          <div className="w-full h-4 bg-gray-100 rounded-full border border-gray-200/50"></div>

          {/* Плаваючі спреди команд */}
          <div className="absolute inset-0 flex flex-col justify-center">
            {data.map((team, index) => {
              const leftPosition = getPercent(team.workload_min);
              const rightPosition = getPercent(team.workload_max);
              const pillWidth = Math.max(1, rightPosition - leftPosition);
              const teamColor = getStatusColor(team.workload_status);

              return (
                <div
                  key={`chart_team_${team.team_name}_${index}`}
                  className="absolute h-4 w-full cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className={`absolute h-full rounded-full shadow-sm transition-all duration-300 ${teamColor} group-hover:scale-y-125 z-10`}
                    style={{
                      left: `${leftPosition}%`,
                      width: `${pillWidth}%`,
                    }}
                  >
                    {/* Біла вертикальна риска по центру спреду */}
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-[60%] bg-white/90 rounded-full"></div>
                  </div>

                  {/* Tooltip */}
                  {hoveredIndex === index && (
                    <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg p-4 flex justify-between items-center text-sm pointer-events-none animate-in fade-in zoom-in duration-200">
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-gray-500 text-xs font-medium">
                          Команда
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {team.team_name}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-gray-500 text-xs font-medium">
                          Статус
                        </span>
                        <span
                          className={`font-semibold ${getStatusColor(team.workload_status, true)}`}
                        >
                          {team.workload_status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Підписи шкали */}
        <div className="flex justify-between w-full mt-2 text-[10px] md:text-xs font-medium text-gray-400">
          <div className="text-left w-1/3">
            <p>&lt;4</p>
            <p>Неповна</p>
          </div>
          <div className="text-center w-1/3">
            <p>4-7</p>
            <p>Оптимальна</p>
          </div>
          <div className="text-right w-1/3">
            <p>7&gt;</p>
            <p>Перенавантаження</p>
          </div>
        </div>

        {/* ФІКС 2: Динамічний Footer із чітким словом "людей" за ТЗ */}
        {totalResponses > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-50 text-[11px] md:text-xs font-medium text-center text-gray-500 leading-relaxed">
            <span className="text-gray-900 font-bold">{riskPct}%</span> команди
            в деструктивній зоні:{" "}
            {totalOverload > 0 ? (
              <span className="text-red-500 font-bold">
                {totalOverload} людей перевантажені
              </span>
            ) : (
              "перевантажених немає"
            )}
            {totalUnderload > 0 && (
              <>
                ,{" "}
                <span className="text-blue-500 font-bold">
                  {totalUnderload} людей недовантажені
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
