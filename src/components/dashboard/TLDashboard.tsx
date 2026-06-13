import { useEffect } from "react";
import { fetchMetrics } from "../../redux/dashboard/operation";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { WorkloadChart } from "./hr/WorkloadChart";
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
      {/* 1. ПІДКЛЮЧЕНІ ВЕРХНІ КАРТКИ */}
      <TopCards
        engagement={metrics.top_cards.engagement}
        trust={metrics.top_cards.trust}
        stress={metrics.top_cards.stress}
      />

      {/* 2. Основна сітка */}
      <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
        <div className="w-full lg:w-7/12 flex flex-col">
          <MetricsHistory heatmapData={metrics.heatmap} />
        </div>

        {/* ПРАВА КОЛОНКА (Навантаженість + Радар) */}
        <div className="w-full lg:w-5/12 flex flex-col gap-4">
          <WorkloadChart data={adaptedWorkload} />
          <RadarChart data={metrics.radar} />
        </div>
        {/* <pre>{JSON.stringify(metrics, null, 2)}</pre> */}
      </div>
    </div>
  );
};
