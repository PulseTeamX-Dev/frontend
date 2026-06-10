import React, { useState, useMemo } from "react";
import type { HeatmapItem } from "../../../types/dashboard/types";
import MetricsHistoryItem from "./MetricsHistoryItem";
import Icon from "../../../shared/Icon";

interface MetricsHistoryListProps {
  metricsHistory: HeatmapItem[];
}

type MetricKey = "stress_index" | "trust_index" | "clarity_index";

const metricOptions: { key: MetricKey; label: string; title: string }[] = [
  {
    key: "stress_index",
    label: "Індекс стресу",
    title: "Рівень стресу по командах",
  },
  {
    key: "trust_index",
    label: "Індекс довіри",
    title: "Рівень довіри по командах",
  },
  {
    key: "clarity_index",
    label: "Індекс розуміння",
    title: "Рівень розуміння цілей",
  },
];

const MetricsHistoryList = ({ metricsHistory }: MetricsHistoryListProps) => {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricKey>("stress_index");

  const dates = useMemo(() => {
    return Array.from(new Set(metricsHistory.map((m) => m.week_start))).sort();
  }, [metricsHistory]);

  const teams = useMemo(() => {
    return Array.from(new Set(metricsHistory.map((m) => m.team_name))).sort();
  }, [metricsHistory]);

  const historyMap = useMemo(() => {
    const map = new Map<string, HeatmapItem>();
    metricsHistory.forEach((item) => {
      map.set(`${item.team_name}_${item.week_start}`, item);
    });
    return map;
  }, [metricsHistory]);

  const currentConfig = metricOptions.find((m) => m.key === selectedMetric)!;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border font-heading border-gray-100 mt-6 w-full mb-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-gray-900 font-light leading-tight">
          {currentConfig.title}
        </h2>

        <div className="flex items-center gap-2 relative">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricKey)}
            className="appearance-none bg-transparent text-sm font-semibold text-gray-900 cursor-pointer outline-none pr-5 z-10"
          >
            {metricOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
          <Icon
            id="caret-down-filled"
            className="w-3 h-3 text-gray-900 absolute right-0 top-1/2 -translate-y-1/2 z-0 pointer-events-none"
          />
        </div>
      </div>

      <div
        className="grid gap-3 w-full"
        style={{
          gridTemplateColumns: `auto repeat(${dates.length}, minmax(60px, 1fr))`,
        }}
      >
        {/* Рядки даних: Назва команди + її клітинки */}
        {teams.map((team) => (
          <React.Fragment key={team}>
            {/* Назва команди зліва */}
            <div className="flex items-center justify-end pr-4 text-sm text-gray-500 font-medium">
              {team}
            </div>

            {/* Клітинки графіка для цієї команди */}
            {dates.map((date) => {
              const dataPoint = historyMap.get(`${team}_${date}`);
              // Беремо значення обраної метрики, якщо дані є
              const value = dataPoint ? dataPoint[selectedMetric] : null;

              return (
                <MetricsHistoryItem
                  key={`${team}_${date}`}
                  value={value as number | null}
                  metricKey={selectedMetric}
                />
              );
            })}
          </React.Fragment>
        ))}

        {/* Останній рядок: Дати (як на дизайні знизу) */}
        <React.Fragment>
          {/* Пуста клітинка зліва під командами */}
          <div></div>

          {dates.map((date) => {
            // Робимо формат дати: з "2026-05-11" робимо "11.05"
            const [, month, day] = date.split("-");
            return (
              <div
                key={`date_${date}`}
                className="text-center text-xs text-gray-500 font-medium pt-2"
              >
                {day}.{month}
              </div>
            );
          })}
        </React.Fragment>
      </div>
    </div>
  );
};

export default MetricsHistoryList;
