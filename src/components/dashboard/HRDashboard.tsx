import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { fetchMetrics } from "../../redux/dashboard/operation";
import { Title } from "../../shared/Title";
import Icon from "../../shared/Icon";
import { MetricSummaryList } from "./hr/MetricSummaryList";
import MetricsHistoryList from "./hr/MetricsHistoryList";
import { SurveyCompletionTable } from "./hr/SurveyCompletionTable";

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

  // console.log("Дані дашборду:", metrics);

  const isHRMetrics = metrics && "metrics_summary" in metrics;

  if (!isHRMetrics) {
    return <div>Помилка: отримано некоректні дані для HR дашборду</div>;
  }

  return (
    <>
      <div className="flex gap-1 items-center mb-6">
        <Icon id="logo" className="w-8 h-8" />
        <Title
          tag="h1"
          className="text-[16px] md:text-[18px] text-grayscale-900 font-second-family font-light"
        >
          Огляд
        </Title>
      </div>
      <MetricSummaryList metricsSummary={metrics.metrics_summary} />
      <MetricsHistoryList metricsHistory={metrics.metrics_history} />
      <SurveyCompletionTable data={metrics.engagement} />

      <pre>{JSON.stringify(metrics, null, 2)}</pre>
    </>
  );
};
