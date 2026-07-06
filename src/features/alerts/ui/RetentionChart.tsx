import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

import type { RetentionMetric } from "@/features/alerts/model/types";

interface Props {
  data: RetentionMetric[];
  role: "hr" | "team_lead";
  setRole: React.Dispatch<React.SetStateAction<"hr" | "team_lead">>;
}

const getBarColor = (minutes: number) => {
  if (minutes < 10) return "#EF4444";

  if (minutes < 15) return "#F59E0B";

  return "#10B981";
};

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: {
    avg_session_minutes: number;
  };
}

const CustomBar = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
}: CustomBarProps) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={8}
      ry={8}
      fill={getBarColor(payload?.avg_session_minutes ?? 0)}
    />
  );
};

const RetentionChart = ({ data, role, setRole }: Props) => {
  const chartData = data.map((item) => ({
    week: new Date(item.week_start).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
    }),

    avg_session_minutes: item.avg_session_minutes ?? 0,
    users: `${item.active_users}/${item.total_users}`,
  }));

  const avgSession =
    data.reduce((sum, item) => sum + (item.avg_session_minutes ?? 0), 0) /
    Math.max(data.length, 1);

  return (
    <div className="bg-white rounded-3xl p-5 h-full min-h-[420px]">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-light leading-6 text-[#222222]">
          Тривалість використання платформи
        </h3>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRole("hr")}
            className={`px-3 py-1 rounded-lg border text-sm ${
              role === "hr" ? "bg-primary text-white" : "bg-white text-gray-700"
            }`}
          >
            HR
          </button>

          <button
            type="button"
            onClick={() => setRole("team_lead")}
            className={`px-3 py-1 rounded-lg border text-sm ${
              role === "team_lead"
                ? "bg-primary text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Тімліди
          </button>
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <div className="text-base leading-6 font-normal text-[#666666]">
          Середня сесія
        </div>
        <div className="text-xl font-semibold text-[#222222]">
          {avgSession.toFixed(0)} хв
        </div>
      </div>

      <div className="mt-6 mb-1 ml-[34px]">
        <span className="text-[#666666]">Сесія, хв.</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 40,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis
            domain={[0, "dataMax + 5"]}
            tickFormatter={(value) => `${value}`}
          />

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;

              const item = payload[0].payload;

              return (
                <div className="rounded-lg border bg-white p-3 shadow-md">
                  <div className="font-medium mb-2">Тиждень: {label}</div>

                  <div>
                    Середня сесія:{" "}
                    <span className="font-medium">
                      {item.avg_session_minutes} хв
                    </span>
                  </div>

                  <div>
                    Коефіцієнт утримання користувачів:{" "}
                    <span className="font-medium">{item.users}</span>
                  </div>
                </div>
              );
            }}
          />

          <ReferenceLine
            y={20}
            stroke="#9CA3AF"
            strokeDasharray="6 4"
            label={{
              value: "Ціль",
              position: "insideTop",
              fill: "#666666",
              fontSize: 12,
              dy: -6,
            }}
          />

          <Bar
            dataKey="avg_session_minutes"
            radius={[8, 8, 0, 0]}
            shape={<CustomBar />}
          >
            <LabelList dataKey="users" position="top" fontSize={11} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RetentionChart;
