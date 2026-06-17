import { useState } from "react";
import type { HRWorkloadCurrent } from "../../../types/dashboard/types";
import { Title } from "../../../shared/Title";

interface WorkloadChartProps {
  data: HRWorkloadCurrent[];
}

export const WorkloadChart = ({ data }: WorkloadChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const averageScore = data.length
    ? (
        data.reduce((sum, item) => sum + item.workload_strain_index, 0) /
        data.length
      ).toFixed(1)
    : "0.0";

  const getDotColor = (score: number) => {
    if (score < 4) return "bg-blue-700";
    if (score < 7) return "bg-green-600";
    return "bg-red-600";
  };

  const getTextColor = (score: number) => {
    if (score < 4) return "text-blue-500";
    if (score < 7) return "text-green-500";
    return "text-red-500";
  };

  const getPercent = (score: number) => {
    const s = Math.max(1, Math.min(10, score));
    if (s < 4) return ((s - 1) / 3) * 30;
    if (s <= 7) return 30 + ((s - 4) / 3) * 40;
    return 70 + ((s - 7) / 3) * 30;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 w-full h-full flex flex-col justify-between relative">
      <Title tag="h2" variant="light">
        Навантаженість
      </Title>

      <div className="grow flex flex-col justify-center mt-3">
        <div className="text-center mb-3">
          <span className="text-2xl font-bold text-green-600">
            {averageScore.replace(".", ",")}
          </span>
          <span className="text-gray-500 text-sm font-medium">/10</span>
        </div>

        <div className="relative w-full">
          {/* 1. Триколірний фон (зменшено висоту до h-12 для компактності) */}
          <div className="flex w-full h-12 rounded-xl overflow-hidden opacity-60">
            <div className="w-[30%] bg-blue-500"></div>
            <div className="w-[40%] bg-green-200"></div>
            <div className="w-[30%] bg-red-500"></div>
          </div>

          {/* 2. Повзунки */}
          <div className="absolute inset-0 flex flex-col justify-evenly py-1">
            {data.map((team, index) => {
              const leftPosition = getPercent(team.workload_min);
              const rightPosition = getPercent(team.workload_max);
              const pillWidth = Math.max(2, rightPosition - leftPosition);

              const dotPercent = getPercent(team.workload_strain_index);
              const dotPositionRelativeToPill =
                pillWidth > 0
                  ? ((dotPercent - leftPosition) / pillWidth) * 100
                  : 0;

              return (
                <div
                  key={`chart_team_${team.team_name}_${index}`}
                  className="relative w-full h-3 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="absolute h-full bg-white/90 rounded-full shadow-sm transition-all duration-200 hover:shadow-md hover:bg-white"
                    style={{
                      left: `${leftPosition}%`,
                      width: `${pillWidth}%`,
                    }}
                  >
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full z-10 ${getDotColor(
                        team.workload_strain_index,
                      )}`}
                      style={{
                        left: `${dotPositionRelativeToPill}%`,
                      }}
                    ></div>
                  </div>

                  {hoveredIndex === index && (
                    <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 flex justify-between items-center text-sm pointer-events-none animate-in fade-in zoom-in duration-200">
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
                          Медіана
                        </span>
                        <span
                          className={`font-semibold text-base ${getTextColor(
                            team.workload_strain_index,
                          )}`}
                        >
                          {team.workload_strain_index
                            .toFixed(1)
                            .replace(".", ",")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Підписи шкали */}
        <div className="flex justify-between w-full mt-3 text-[10px] md:text-xs font-medium">
          <div className="text-blue-500 text-left">
            <p>&lt;4</p>
            <p>Неповна</p>
          </div>
          <div className="text-green-500 text-center">
            <p>4-7</p>
            <p>Оптимальна</p>
          </div>
          <div className="text-red-500 text-right">
            <p>7&gt;</p>
            <p>Перенавантаження</p>
          </div>
        </div>
      </div>
    </div>
  );
};
