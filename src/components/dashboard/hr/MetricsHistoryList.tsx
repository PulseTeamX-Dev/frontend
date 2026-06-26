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

        {/* Контейнер фільтру */}
        <div className="relative z-30">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-bold transition-all duration-200 select-none ${
              isDropdownOpen
                ? "bg-[#F26522] text-white rounded-t-xl rounded-b-none" // 🛠️ Коли відкритий: помаранчевий фон, нижні кути гострі
                : "bg-transparent text-grayscale-900 hover:text-[#F26522] rounded-md"
            }`}
          >
            {currentConfig.label}
            {/* 🛠️ ФІКС: Змінили іконку caret на тонку chevron для повної відповідності */}
            <Icon
              id={isDropdownOpen ? "chevron-up" : "chevron-down"}
              className={`w-3.5 h-3.5 transition-colors duration-200 ${
                isDropdownOpen ? "text-white" : "text-grayscale-600"
              }`}
            />
          </button>

          {/* Випадаюче меню */}
          {isDropdownOpen && (
            <div
              // 🛠️ ФІКС: Вирівнюємо меню по лівому краю кнопки (left-0), ставимо фіксовану ширину w-[190px] та округлюємо всі кути крім верхнього лівого за логікою макету
              className="absolute left-0 top-full w-[140.5px] bg-white border border-gray-200 shadow-lg rounded-xl rounded-tl-none rounded-tr-none overflow-hidden py-0.5 z-40 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150"
            >
              {metricOptions.map((opt) => {
                const isSelected = selectedMetric === opt.key;
                return (
                  <button
                    key={opt.key}
                    className={`text-left px-4 py-2.5 text-sm transition-colors border-b border-gray-100 last:border-0 hover:bg-gray-50/80 ${
                      isSelected
                        ? "text-grayscale-900 font-bold bg-gray-50/50"
                        : "text-grayscale-700 font-medium"
                    }`}
                    onClick={() => {
                      setSelectedMetric(opt.key);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
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
