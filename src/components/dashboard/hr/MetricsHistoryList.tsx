import React, { useState, useMemo } from "react";
import type { HeatmapItem } from "../../../types/dashboard/types";
import MetricsHistoryItem from "./MetricsHistoryItem";
import Icon from "../../../shared/Icon";

interface MetricsHistoryListProps {
  metricsHistory: HeatmapItem[];
}

// 1. Додали нову метрику
type MetricKey =
  | "stress_index"
  | "trust_index"
  | "clarity_index"
  | "workload_strain_index";

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
  {
    key: "workload_strain_index",
    label: "Індекс навантаження",
    title: "Деструктивне навантаження",
  },
];

const MetricsHistoryList = ({ metricsHistory }: MetricsHistoryListProps) => {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricKey>("stress_index");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Стан для кастомного дропдауну

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

  // Визначаємо поточний (найновіший) тиждень для передачі в Item
  const latestWeek = dates[dates.length - 1];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border font-heading border-gray-100 mt-6 w-full mb-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-gray-900 font-light leading-tight">
          {currentConfig.title}
        </h2>

        {/* 3. Кастомний Dropdown (як на макеті) */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-semibold transition-colors"
          >
            {currentConfig.label}
            <Icon
              id="caret-down-filled"
              className={`w-3 h-3 text-white transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Випадаючий список */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md py-1 z-20 flex flex-col">
              {metricOptions.map((opt) => (
                <button
                  key={opt.key}
                  className={`text-left px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50 ${
                    selectedMetric === opt.key
                      ? "text-gray-900 bg-gray-50"
                      : "text-gray-600"
                  }`}
                  onClick={() => {
                    setSelectedMetric(opt.key);
                    setIsDropdownOpen(false); // Закриваємо при виборі
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="grid gap-3 w-full"
        style={{
          gridTemplateColumns: `auto repeat(${dates.length}, minmax(60px, 1fr))`,
        }}
      >
        {teams.map((team) => (
          <React.Fragment key={team}>
            <div className="flex items-center justify-end pr-4 text-sm text-gray-500 font-medium">
              {team}
            </div>

            {dates.map((date) => {
              const dataPoint = historyMap.get(`${team}_${date}`);
              const value = dataPoint ? dataPoint[selectedMetric] : null;

              return (
                <MetricsHistoryItem
                  key={`${team}_${date}`}
                  value={value as number | null}
                  metricKey={selectedMetric}
                  isCurrentWeek={date === latestWeek} // <--- Передаємо флаг поточного тижня
                />
              );
            })}
          </React.Fragment>
        ))}

        <React.Fragment>
          <div></div>
          {dates.map((date) => {
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
