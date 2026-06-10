// Типізація на основі твого бекенду
interface WorkloadData {
  team_name: string;
  workload_strain_index: number; // крапка
  workload_min: number; // початок пігулки
  workload_max: number; // кінець пігулки
}

interface WorkloadChartProps {
  data: WorkloadData[];
}

export const WorkloadChart = ({ data }: WorkloadChartProps) => {
  // Загальна шкала від 0 до 10
  const MAX_SCORE = 10;

  // Вираховуємо середній бал по всіх командах (велика цифра зверху)
  const averageScore = data.length
    ? (
        data.reduce((sum, item) => sum + item.workload_strain_index, 0) /
        data.length
      ).toFixed(1)
    : "0.0";

  // Функція для визначення кольору крапки
  const getDotColor = (score: number) => {
    if (score < 4) return "bg-blue-500";
    if (score < 7) return "bg-green-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full mb-6">
      <h2 className="text-[20px] text-gray-900 font-light leading-tight mb-2">
        Навантаженість
      </h2>

      {/* Головна цифра */}
      <div className="text-center mb-6">
        <span className="text-2xl font-bold text-green-600">
          {averageScore}
        </span>
        <span className="text-gray-500 text-sm font-medium">/10</span>
      </div>

      {/* Контейнер графіка */}
      <div className="relative w-full">
        {/* 1. ТРИКОЛІРНИЙ ФОН */}
        <div className="flex w-full h-28 rounded-xl overflow-hidden opacity-60">
          {/* < 4 (40% ширини) */}
          <div className="w-[40%] bg-[#d0eefc]"></div>
          {/* 4 - 7 (30% ширини) */}
          <div className="w-[30%] bg-[#d1f4da]"></div>
          {/* > 7 (30% ширини) */}
          <div className="w-[30%] bg-[#fbe0e0]"></div>
        </div>

        {/* 2. ПОВЗУНКИ (ПІГУЛКИ КОМАНД) */}
        {/* Накладаємо їх абсолютом поверх фону, рівномірно розподіляючи по вертикалі */}
        <div className="absolute inset-0 flex flex-col justify-evenly py-2">
          {data.map((team, index) => {
            // Математика для Tailwind (перетворюємо 0-10 на 0-100%)
            const leftPosition = (team.workload_min / MAX_SCORE) * 100;
            const pillWidth =
              ((team.workload_max - team.workload_min) / MAX_SCORE) * 100;

            // Позиція крапки всередині пігулки
            const dotPositionRelativeToPill =
              ((team.workload_strain_index - team.workload_min) /
                (team.workload_max - team.workload_min)) *
              100;

            return (
              <div key={`workload_${index}`} className="relative w-full h-3">
                {/* Сама біла пігулка */}
                <div
                  className="absolute h-full bg-white/90 rounded-full shadow-sm"
                  style={{
                    left: `${leftPosition}%`,
                    width: `${pillWidth}%`,
                  }}
                >
                  {/* Крапка поточного значення */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ${getDotColor(
                      team.workload_strain_index,
                    )}`}
                    style={{
                      left: `${dotPositionRelativeToPill}%`,
                      // Трохи зсуваємо, щоб крапка була точно по центру свого значення
                      transform: "translate(-50%, -50%)",
                    }}
                  ></div>
                </div>
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
