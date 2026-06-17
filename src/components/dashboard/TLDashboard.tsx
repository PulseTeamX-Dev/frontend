import { useEffect } from "react";
import { fetchMetrics } from "../../redux/dashboard/operation";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { MetricsHistory } from "./tl/MetricsHistory";
import { TopCards } from "./tl/TopCards";
import { RadarChart } from "./tl/RadarChart";
// Імпортуємо інтерфейс, який ми щойно створили в types
import type { TeamLeadMetrics } from "../../redux/dashboard/types";
import Icon from "../../shared/Icon";

export const TLDashboard = () => {
  const dispatch = useAppDispatch();
  const { metrics, isLoading, error } = useAppSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchMetrics());
  }, [dispatch]);

  if (isLoading) return <div>Завантаження...</div>;
  if (error) return <div>Помилка: {error}</div>;
  if (!metrics) return null;

  const isTLMetrics = "top_cards" in metrics;

  if (!isTLMetrics) {
    return <div>Помилка: отримано некоректні дані для TL дашборду</div>;
  }

  // МАГІЯ ТАЙПСКРИПТУ: Кастимо до конкретного типу, оскільки перевірку вище пройдено успішно
  const tlMetrics = metrics as TeamLeadMetrics;

  const isPrivacyLocked = tlMetrics.privacy_block;
  const currentCount = tlMetrics.current_count ?? 0;

  const teamName = tlMetrics.heatmap?.[0]?.team_name || "Команда";

  const adaptedWorkload = [
    {
      team_name: teamName,
      workload_strain_index: tlMetrics.workload?.score ?? 0,
      workload_min: tlMetrics.workload?.min ?? 0,
      workload_max: tlMetrics.workload?.max ?? 0,
      workload_status: tlMetrics.workload?.status || "Unknown",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ПОВІДОМЛЕННЯ ПРО ЗБІР ДАНИХ */}
      {isPrivacyLocked && (
        <div className="w-full bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3 text-orange-800 animate-in fade-in duration-300">
          <Icon
            id="circle-warning-filled"
            className="w-6 h-6 text-orange-500 shrink-0"
          />
          <div className="text-sm font-medium">
            <p className="font-bold">Збір відповідей триває</p>
            <p className="text-orange-700 font-normal mt-0.5">
              Поточні аналітичні метрики та Радар приховані з міркувань
              анонімності, оскільки ваша команда надала лише{" "}
              <span className="font-bold text-orange-900">
                {currentCount} з 5
              </span>{" "}
              необхідних відповідей. Історія опитувань (Хітмеп) залишається
              доступною.
            </p>
          </div>
        </div>
      )}

      {/* 1. ВЕРХНІ КАРТКИ */}
      <div
        className={`transition-all duration-300 ${isPrivacyLocked ? "opacity-40 pointer-events-none filter blur-[1px]" : ""}`}
      >
        <TopCards
          engagement={tlMetrics.top_cards.engagement}
          trust={tlMetrics.top_cards.trust}
          stress={tlMetrics.top_cards.stress}
          workload={adaptedWorkload}
        />
      </div>

      <div className="flex flex-col xl:flex-row gap-4 w-full items-stretch">
        <div className="w-full xl:w-1/2 flex flex-col">
          <MetricsHistory heatmapData={tlMetrics.heatmap} />
        </div>

        <div
          className={`w-full xl:w-1/2 flex flex-col transition-all duration-300 ${isPrivacyLocked ? "opacity-40 pointer-events-none filter blur-[2px]" : ""}`}
        >
          <RadarChart data={tlMetrics.radar} />
        </div>
      </div>
    </div>
  );
};
