import { useState, useEffect } from "react";
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RadarData } from "../../../redux/dashboard/types";
import { Title } from "../../../shared/Title";

interface RadarChartProps {
  data: RadarData[];
}

type SVGTextAnchor = "start" | "middle" | "end";

interface CustomAxisTickProps {
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  payload?: {
    value: string;
  };
}

const CustomAxisTick = (props: CustomAxisTickProps) => {
  const { x = 0, y = 0, payload, cx = 0, cy = 0 } = props;

  if (!payload) return null;

  const dx = x - cx;
  const dy = y - cy;
  const distance = Math.sqrt(dx * dx + dy * dy) || 1;

  const offset = 14;
  const nextX = x + (dx / distance) * offset;
  const nextY = y + (dy / distance) * offset;

  let textAnchor: SVGTextAnchor = "middle";
  if (dx > 5) textAnchor = "start";
  if (dx < -5) textAnchor = "end";

  const words = payload.value.split(" ");
  const isMultiLine = words.length > 1 && payload.value.length > 10;

  return (
    <g>
      <text
        x={nextX}
        y={nextY}
        textAnchor={textAnchor}
        dominantBaseline="central"
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: "13px",
          fill: "#666666",
        }}
      >
        {isMultiLine ? (
          <>
            <tspan x={nextX} dy="-0.4em">
              {words[0]}
            </tspan>
            <tspan x={nextX} dy="1.2em">
              {words.slice(1).join(" ")}
            </tspan>
          </>
        ) : (
          payload.value
        )}
      </text>
    </g>
  );
};

export const RadarChart = ({ data }: RadarChartProps) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isDesktop = windowWidth >= 1024;

  const chartHeight = isMobile ? 280 : isDesktop ? 440 : 340;
  const chartRadius = isMobile ? "50%" : isDesktop ? "75%" : "65%";

  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort(
    (a, b) =>
      new Date(b.week_start).getTime() - new Date(a.week_start).getTime(),
  );

  const currentWeek = sortedData[0];
  const previousWeek = sortedData[1];

  const chartData = [
    {
      subject: "Стресостійкість",
      current: currentWeek?.axis_stress_inv || 0,
      previous: previousWeek?.axis_stress_inv || 0,
    },
    {
      subject: "Гармонія",
      current: currentWeek?.axis_conflict_inv || 0,
      previous: previousWeek?.axis_conflict_inv || 0,
    },
    {
      subject: "Довіра",
      current: currentWeek?.axis_trust || 0,
      previous: previousWeek?.axis_trust || 0,
    },
    {
      subject: "Ясність",
      current: currentWeek?.axis_clarity || 0,
      previous: previousWeek?.axis_clarity || 0,
    },
    {
      subject: "Баланс навантаження",
      current: currentWeek?.axis_workload_balance || 0,
      previous: previousWeek?.axis_workload_balance || 0,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 w-full flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 w-full">
        <Title tag="h2" variant="light">
          Радар команди
        </Title>

        <div className="flex items-center gap-4 text-xs font-medium text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#fb9b6e] rounded-sm opacity-80"></span>
            <span>Поточний тиждень</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#66c5f1] rounded-sm opacity-80"></span>
            <span>Минулий тиждень</span>
          </div>
        </div>
      </div>

      {/* 4. Передаем вычисленную высоту прямо в контейнер */}
      <div
        className="w-full flex items-center justify-center px-0 sm:px-4 transition-all duration-300"
        style={{ height: chartHeight }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart
            className="overflow-visible"
            cx="50%"
            cy="50%"
            outerRadius={chartRadius} // Передаем вычисленный радиус
            data={chartData}
          >
            <PolarGrid stroke="#e5e7eb" />

            <PolarAngleAxis dataKey="subject" tick={<CustomAxisTick />} />

            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
              tickCount={6}
            />

            <Tooltip
              animationDuration={150}
              animationEasing="ease-out"
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05)",
              }}
              itemStyle={{ fontWeight: 600, fontSize: "14px" }}
            />

            <Radar
              name="Минулий тиждень"
              dataKey="previous"
              stroke="#66c5f1"
              fill="#66c5f1"
              fillOpacity={0.15}
            />
            <Radar
              name="Поточний тиждень"
              dataKey="current"
              stroke="#fb9b6e"
              fill="#fb9b6e"
              fillOpacity={0.2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
