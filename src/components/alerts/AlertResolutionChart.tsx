import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Bar,
} from "recharts";

import type { AlertResolution } from "../../redux/alerts/types";

interface Props {
  data: AlertResolution[];
}

interface ProgressBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: {
    total: number;
    resolved: number;
    color: string;
  };
}

const ProgressBar = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
}: ProgressBarProps) => {
  if (!payload) return null;

  const safeWidth = Math.max(width, 0);
  const safeHeight = Math.max(height, 0);

  const { total, resolved, color } = payload;
  const percent = total > 0 ? resolved / total : 0;
  const fillHeight = safeHeight * percent;

  return (
    <g>
      {/* фон total */}
      <rect
        x={x}
        y={y}
        width={safeWidth}
        height={safeHeight}
        rx={6}
        fill={color}
        opacity={0.25}
      />

      {/* resolved */}
      <rect
        x={x}
        y={y + safeHeight - fillHeight}
        width={safeWidth}
        height={Math.max(fillHeight, 0)}
        rx={6}
        fill={color}
      />

      {/* пунктир якщо нічого не закрито */}
      {resolved === 0 && (
        <rect
          x={x}
          y={y}
          width={safeWidth}
          height={safeHeight}
          rx={6}
          fill="none"
          stroke={color}
          strokeDasharray="4 4"
        />
      )}
    </g>
  );
};

const AlertResolutionChart = ({ data }: Props) => {
  if (!data.length) return null;

  const latest = data[data.length - 1];

  const chartData = data.map((item) => ({
    week: new Date(item.week_start).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
    }),

    criticalBar: item.critical_total,
    criticalTotal: item.critical_total,
    criticalResolved: item.critical_resolved,

    warningBar: item.warning_total,
    warningTotal: item.warning_total,
    warningResolved: item.warning_resolved,

    avgResolutionHours: item.avg_resolution_hours,
  }));

  return (
    <div className="bg-white rounded-3xl border p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
        {/* ГРАФІК */}
        <div>
          <h3 className="text-2xl font-semibold mb-1">Реагування на сигнали</h3>

          <p className="text-sm text-gray-500 mb-4">
            Зафарбована частина стовпців — кількість вирішених сигналів
          </p>

          <div className="flex gap-6 text-sm font-medium mb-4">
            <span className="text-gray-700">Кіл-ть сповіщень</span>

            <span className="text-blue-600">Час на розв'язання (год)</span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={chartData} barCategoryGap="10%">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" unit=" год" />
              <Tooltip />
              <Legend />

              {/* CRITICAL */}
              <Bar
                yAxisId="left"
                dataKey="criticalBar"
                maxBarSize={24}
                minPointSize={2}
                name="Critical"
                shape={(props) => (
                  <ProgressBar
                    {...props}
                    payload={{
                      total: props.payload.criticalTotal,
                      resolved: props.payload.criticalResolved,
                      color: "#ef4444",
                    }}
                  />
                )}
              />

              {/* WARNING */}
              <Bar
                yAxisId="left"
                dataKey="warningBar"
                maxBarSize={24}
                minPointSize={2}
                name="Warning"
                shape={(props) => (
                  <ProgressBar
                    {...props}
                    payload={{
                      total: props.payload.warningTotal,
                      resolved: props.payload.warningResolved,
                      color: "#f59e0b",
                    }}
                  />
                )}
              />

              {/* LINE */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgResolutionHours"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Час на розв'язання"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* KPI */}
        <div className="border-l pl-6">
          <div className="text-sm text-gray-500">ПОТОЧНИЙ ТИЖДЕНЬ</div>

          <div
            className={`text-5xl font-bold mt-2 ${
              latest.resolution_rate_pct < 50
                ? "text-red-600"
                : latest.resolution_rate_pct < 70
                  ? "text-yellow-600"
                  : "text-green-600"
            }`}
          >
            {latest.resolution_rate_pct}%
          </div>

          <div className="text-lg mt-4">Вирішено:</div>

          <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full rounded-full"
              style={{
                width: `${latest.resolution_rate_pct}%`,
              }}
            />
          </div>

          <div className="mt-4 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
            ⚠ {latest.unresolved_count} не закрито
          </div>

          <div className="mt-10">
            <div className="text-sm text-gray-500 uppercase">
              Медіана відповіді
            </div>

            <div className="flex items-center gap-2 text-2xl font-semibold mt-2">
              ⏱{latest.median_resolution_hours} години
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertResolutionChart;
