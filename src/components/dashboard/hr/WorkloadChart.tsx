import { useState } from "react";
import type { HRWorkloadCurrent } from "../../../types/dashboard/types";

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
    if (score < 4) return "bg-blue-500";
    if (score < 7) return "bg-green-500";
    return "bg-red-500";
  };

  const getTextColor = (score: number) => {
    if (score < 4) return "text-blue-500";
    if (score < 7) return "text-green-500";
    return "text-red-500";
  };

  // Функція для точного переведення шкали 1-10 у відсотки 0-100%
  const getPercent = (score: number) => {
    const clamped = Math.max(1, Math.min(10, score));
    return ((clamped - 1) / 9) * 100;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full mb-6 relative">
      <h2 className="text-[20px] text-gray-900 font-light leading-tight mb-2">
        Навантаженість
      </h2>

      <div className="text-center mb-6">
        <span className="text-2xl font-bold text-green-600">
          {averageScore.replace(".", ",")}
        </span>
        <span className="text-gray-500 text-sm font-medium">/10</span>
      </div>

      <div className="relative w-full">
        {/* 1. ТРИКОЛІРНИЙ ФОН (Пропорції шкали 1-10) */}
        <div className="flex w-full h-28 rounded-xl overflow-hidden opacity-60">
          {/* Зона 1 - 3 (Неповна): ширина 22.22% */}
          <div className="w-[22.2222%] bg-[#d0eefc]"></div>
          {/* Зона 3 - 7 (Оптимальна): ширина 44.4444% */}
          <div className="w-[44.4444%] bg-[#d1f4da]"></div>
          {/* Зона 7 - 10 (Перенавантаження): ширина 33.3333% */}
          <div className="w-[33.3334%] bg-[#fbe0e0]"></div>
        </div>

        {/* 2. ПОВЗУНКИ (ПІГУЛКИ КОМАНД) */}
        <div className="absolute inset-0 flex flex-col justify-evenly py-2">
          {data.map((team, index) => {
            const leftPosition = getPercent(team.workload_min);
            const rightPosition = getPercent(team.workload_max);
            const pillWidth = rightPosition - leftPosition;

            // Позиція крапки всередині самої пігулки у відсотках
            const dotPercent = getPercent(team.workload_strain_index);
            const dotPositionRelativeToPill =
              pillWidth > 0
                ? ((dotPercent - leftPosition) / pillWidth) * 100
                : 0;

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
                  {/* Крапка (ЦЕНТРОВАНА за рахунок поєднання translate-x і left) */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full z-10 ${getDotColor(
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
                      <span className="text-grayscale-700 text-xs font-medium">
                        Команда
                      </span>
                      <span className="text-grayscale-900 font-semibold">
                        {team.team_name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-grayscale-700 text-xs font-medium">
                        Медіана
                      </span>
                      <span
                        className={`font-semibold text-base ${getTextColor(team.workload_strain_index)}`}
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
