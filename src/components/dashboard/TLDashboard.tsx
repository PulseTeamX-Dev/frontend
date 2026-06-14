import { useEffect } from "react";
import { fetchMetrics } from "../../redux/dashboard/operation";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { MetricsHistory } from "./tl/MetricsHistory";
import { TopCards } from "./tl/TopCards";
import { RadarChart } from "./tl/RadarChart";

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

  const teamName = metrics.heatmap[0]?.team_name || "Команда";

  const adaptedWorkload = [
    {
      team_name: teamName,
      workload_strain_index: metrics.workload.score,
      workload_min: metrics.workload.min,
      workload_max: metrics.workload.max,
      workload_status: metrics.workload.status,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. ПІДКЛЮЧЕНІ ВЕРХНІ КАРТКИ (4 колонки) */}
      <TopCards
        engagement={metrics.top_cards.engagement}
        trust={metrics.top_cards.trust}
        stress={metrics.top_cards.stress}
        workload={adaptedWorkload}
      />

      {/* 2. Основна сітка (50 на 50) */}
      <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
        {/* ЛІВА КОЛОНКА (Хітмеп) */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <MetricsHistory heatmapData={metrics.heatmap} />
        </div>

        {/* ПРАВА КОЛОНКА (Радар) */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <RadarChart data={metrics.radar} />
        </div>
      </div>
    </div>
  );
};
