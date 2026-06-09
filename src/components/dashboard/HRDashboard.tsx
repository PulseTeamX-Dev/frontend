import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { fetchMetrics } from "../../redux/dashboard/operation";
import { Title } from "../../shared/Title";
import Icon from "../../shared/Icon";
import { MetricSummaryList } from "./MetricSummaryList";

export const HRDashboard = () => {
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

  console.log("Дані дашборду:", metrics);

  const isHRMetrics = metrics && "metrics_summary" in metrics;

  if (!isHRMetrics) {
    return <div>Помилка: отримано некоректні дані для HR дашборду</div>;
  }

  return (
    <div>
      <div className="flex gap-1 items-center">
        <Icon id="logo" className="w-8 h-8" />
        <Title tag="h1">Огляд</Title>
      </div>
      <MetricSummaryList metricsSummary={metrics.metrics_summary} />
      {/* <pre>{JSON.stringify(metrics, null, 2)}</pre> */}
    </div>
  );
};
