import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis, // <--- Додали вісь радіуса
  Tooltip, // <--- Додали тултіп
  ResponsiveContainer,
} from "recharts";
import type { RadarData } from "../../../redux/dashboard/types";
import { Title } from "../../../shared/Title";

interface RadarChartProps {
  data: RadarData[];
}

export const RadarChart = ({ data }: RadarChartProps) => {
  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort(
    (a, b) =>
      new Date(b.week_start).getTime() - new Date(a.week_start).getTime(),
  );

  const currentWeek = sortedData[0];
  const previousWeek = sortedData[1];

  const chartData = [
    {
      subject: "Спокій",
      current: currentWeek?.axis_stress_inv || 0,
      previous: previousWeek?.axis_stress_inv || 0,
    },
    {
      subject: "Гармонія",
      current: currentWeek?.axis_conflict_inv || 0,
      previous: previousWeek?.axis_conflict_inv || 0,
    },
    {
      subject: "Підтримка",
      current: currentWeek?.axis_trust || 0,
      previous: previousWeek?.axis_trust || 0,
    },
    {
      subject: "Ясність",
      current: currentWeek?.axis_clarity || 0,
      previous: previousWeek?.axis_clarity || 0,
    },
    {
      subject: "Навантаженість",
      current: currentWeek?.axis_workload_balance || 0,
      previous: previousWeek?.axis_workload_balance || 0,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 w-full flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 w-full">
        <Title tag="h2" variant="light">
          Радар команди
        </Title>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#fca5a5] rounded-sm opacity-80"></span>
            <span>Поточний тиждень</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#38bdf8] rounded-sm opacity-80"></span>
            <span>Минулий тиждень</span>
          </div>
        </div>
      </div>

      <div className="w-full flex-grow relative min-h-[280px] text-xs flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          {/* Додали outerRadius 70% щоб звільнити місце для цифр шкали */}
          <RechartsRadarChart
            cx="50%"
            cy="50%"
            outerRadius="70%"
            data={chartData}
          >
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#4b5563", fontSize: 12, fontWeight: 500 }}
            />

            {/* ФІКС: Жорстко фіксуємо шкалу від 0 до 10, додаємо 6 поділок (0,2,4,6,8,10) */}
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              tickCount={6}
            />

            {/* ФІКС: Красивий тултіп при наведенні */}
            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ fontWeight: 600, fontSize: "14px" }}
            />

            <Radar
              name="Минулий тиждень"
              dataKey="previous"
              stroke="#38bdf8"
              fill="#0ea5e9"
              fillOpacity={0.15}
            />
            <Radar
              name="Поточний тиждень"
              dataKey="current"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
