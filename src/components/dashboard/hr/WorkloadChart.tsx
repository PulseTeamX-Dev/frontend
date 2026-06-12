import { useState } from "react";
import type { HRWorkloadCurrent } from "../../../types/dashboard/types";

interface WorkloadChartProps {
  data: HRWorkloadCurrent[];
}

export const WorkloadChart = ({ data }: WorkloadChartProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const MAX_SCORE = 10;

  const averageScore = data.length
    ? (
        data.reduce((sum, item) => sum + item.workload_strain_index, 0) /
        data.length
      ).toFixed(1)
    : "0.0";

  const getDotColor = (score: number) => {
    if (score < 4) return "bg-blue-500";
    if (score < 7) return "bg-green-500";
    return "bg-red-500";
  };

  const getTextColor = (score: number) => {
    if (score < 4) return "text-blue-500";
    if (score < 7) return "text-green-500";
    return "text-red-500";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full mb-6 relative">
      <h2 className="text-[20px] text-gray-900 font-light leading-tight mb-2">
        Навантаженість
      </h2>

      <div className="text-center mb-6">
        <span className="text-2xl font-bold text-green-600">
          {averageScore}
        </span>
        <span className="text-gray-500 text-sm font-medium">/10</span>
      </div>

      <div className="relative w-full">
        {/* 1. ТРИКОЛІРНИЙ ФОН */}
        <div className="flex w-full h-28 rounded-xl overflow-hidden opacity-60">
          <div className="w-[40%] bg-[#d0eefc]"></div>
          <div className="w-[30%] bg-[#d1f4da]"></div>
          <div className="w-[30%] bg-[#fbe0e0]"></div>
        </div>

        {/* 2. ПОВЗУНКИ (ПІГУЛКИ КОМАНД) */}
        <div className="absolute inset-0 flex flex-col justify-evenly py-2">
          {data.map((team, index) => {
            const leftPosition = (team.workload_min / MAX_SCORE) * 100;
            const pillWidth =
              ((team.workload_max - team.workload_min) / MAX_SCORE) * 100;

            const dotPositionRelativeToPill =
              ((team.workload_strain_index - team.workload_min) /
                (team.workload_max - team.workload_min)) *
              100;

            return (
              <div
                key={`workload_${index}`}
                className="relative w-full h-3 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Біла пігулка */}
                <div
                  className="absolute h-full bg-white/90 rounded-full shadow-sm transition-all duration-200 hover:shadow-md hover:bg-white"
                  style={{
                    left: `${leftPosition}%`,
                    width: `${pillWidth}%`,
                  }}
                >
                  {/* Крапка (ВІДЦЕНТРОВАНА) */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${getDotColor(
                      team.workload_strain_index,
                    )}`}
                    style={{
                      left: `${dotPositionRelativeToPill}%`,
                    }}
                  ></div>
                </div>

                {/* Тултип (Hover Card) */}
                {hoveredIndex === index && (
                  <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-4 flex justify-between items-center text-sm pointer-events-none animate-in fade-in zoom-in duration-200">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-grayscale-700 text-[14px] text-center">
                        Команда
                      </span>
                      <span className="text-grayscale-900 text-[14px] text-center">
                        {team.team_name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-grayscale-700 text-[14px] text-center">
                        Медіана
                      </span>
                      <span
                        className={`text-[14px] text-center ${getTextColor(team.workload_strain_index)}`}
                      >
                        {team.workload_strain_index.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ПІДПИСИ ШКАЛИ */}
      <div className="flex justify-between w-full mt-4 text-xs font-medium">
        <div className="text-blue-400 text-left">
          <p>&lt;4</p>
          <p>Неповна</p>
        </div>
        <div className="text-green-500 text-center">
          <p>4-7</p>
          <p>Оптимальна</p>
        </div>
        <div className="text-red-400 text-right">
          <p>7&gt;</p>
          <p>Перенавантаження</p>
        </div>
      </div>
    </div>
  );
};
