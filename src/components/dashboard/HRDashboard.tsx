import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { fetchMetrics } from "../../redux/dashboard/operation";
import { MetricSummaryList } from "./hr/MetricSummaryList";
import MetricsHistoryList from "./hr/MetricsHistoryList";
import { SurveyCompletionTable } from "./hr/SurveyCompletionTable";
import { WorkloadChart } from "./hr/WorkloadChart";

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

  const isHRMetrics = metrics && "metrics_summary" in metrics;

  if (!isHRMetrics) {
    return <div>Помилка: отримано некоректні дані для HR дашборду</div>;
  }

  return (
    <>
      {/* <div className="flex gap-1 items-center mb-6">
        <Icon id="logo" className="w-8 h-8" />
        <Title
          tag="h1"
          className="text-[16px] md:text-[18px] text-grayscale-900 font-second-family font-light"
        >
          Огляд
        </Title>
      </div> */}

      <MetricSummaryList metricsSummary={metrics.metrics_summary} />

      <div className="flex flex-col lg:flex-row gap-4 mt-6 w-full items-stretch">
        <div className="w-full lg:w-7/12 flex flex-col">
          <MetricsHistoryList metricsHistory={metrics.metrics_history} />
        </div>
        <div className="w-full lg:w-5/12 flex flex-col gap-4">
          <SurveyCompletionTable data={metrics.engagement} />
          <WorkloadChart data={metrics.workload_current} />
        </div>
      </div>

      {/* <pre>{JSON.stringify(metrics, null, 2)}</pre> */}
    </>
  );
};
