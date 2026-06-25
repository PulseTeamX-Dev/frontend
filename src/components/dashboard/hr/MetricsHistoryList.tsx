import React, { useState, useMemo } from "react";
import type { HeatmapItem } from "../../../types/dashboard/types";
import MetricsHistoryItem from "./MetricsHistoryItem";
import Icon from "../../../shared/Icon";
import { Title } from "../../../shared/Title";

interface MetricsHistoryListProps {
  metricsHistory: HeatmapItem[];
}

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
];

const MetricsHistoryList = ({ metricsHistory }: MetricsHistoryListProps) => {
  const [selectedMetric, setSelectedMetric] =
    useState<MetricKey>("stress_index");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dates = useMemo(
    () =>
      Array.from(new Set(metricsHistory.map((m) => m.week_start)))
        .sort()
        .slice(-6),
    [metricsHistory],
  );

  const teams = useMemo(() => {
    const uniqueTeamsMap = new Map<string, number>();

    metricsHistory.forEach((item) => {
      if (item.team_name) {
        const currentStoredId = uniqueTeamsMap.get(item.team_name);
        if (currentStoredId === undefined || currentStoredId === 999) {
          uniqueTeamsMap.set(item.team_name, item.team_id ?? 999);
        }
      }
    });

    return Array.from(uniqueTeamsMap.entries())
      .sort((a, b) => {
        if (a[1] !== b[1]) {
          return a[1] - b[1];
        }
        return a[0].localeCompare(b[0]);
      })
      .map((entry) => entry[0]);
  }, [metricsHistory]);

  const historyMap = useMemo(() => {
    const map = new Map<string, HeatmapItem>();
    metricsHistory.forEach((item) =>
      map.set(`${item.team_name}_${item.week_start}`, item),
    );
    return map;
  }, [metricsHistory]);

  const currentConfig = metricOptions.find((m) => m.key === selectedMetric)!;
  const latestWeek = dates[dates.length - 1];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full flex-1 flex flex-col min-h-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 shrink-0">
        <Title tag="h2" variant="light" className="mb-0">
          {currentConfig.title}
        </Title>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary-active hover:bg-primary-hover text-white rounded-md text-sm font-semibold transition-colors"
          >
            {currentConfig.label}
            <Icon
              id="caret-down-filled"
              className={`w-3 h-3 text-white transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md py-1 z-20 flex flex-col">
              {metricOptions.map((opt) => (
                <button
                  key={opt.key}
                  className={`text-left px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50 ${
                    selectedMetric === opt.key
                      ? "text-grayscale-900 bg-gray-50"
                      : "text-grayscale-600"
                  }`}
                  onClick={() => {
                    setSelectedMetric(opt.key);
                    setIsDropdownOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Зона контенту з внутрішнім скролом */}
      <div className="w-full flex-1 overflow-y-auto overflow-x-auto min-h-0 pb-2 custom-scrollbar pr-1">
        <div
          className="grid gap-3 min-w-[420px] min-h-full"
          style={{
            gridTemplateColumns: `auto repeat(${dates.length}, minmax(64px, 1fr))`,
            gridTemplateRows:
              teams.length > 0
                ? `repeat(${teams.length}, minmax(56px, 1fr)) auto`
                : "auto",
          }}
        >
          {teams.map((team) => (
            <React.Fragment key={team}>
              <div className="flex items-center justify-end pr-4 text-[13px] md:text-sm text-gray-500 font-medium h-full">
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
                    isCurrentWeek={date === latestWeek}
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
                  className="text-center text-[11px] md:text-xs text-gray-400 font-medium pt-2"
                >
                  {day}.{month}
                </div>
              );
            })}
          </React.Fragment>
        </div>
      </div>
    </div>
  );
};

export default MetricsHistoryList;
