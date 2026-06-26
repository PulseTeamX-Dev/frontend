import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { fetchMetrics } from "../../redux/dashboard/operation";
import { MetricSummaryList } from "./hr/MetricSummaryList";
import MetricsHistoryList from "./hr/MetricsHistoryList";
import { SurveyCompletionTable } from "./hr/SurveyCompletionTable";
import { WorkloadChart } from "./hr/WorkloadChart";
import { PageHeader } from "../../shared/PageHeader";
import { PageLoader } from "../../shared/Loader";

export const HRDashboard = () => {
  const dispatch = useAppDispatch();
  const { metrics, isLoading, error } = useAppSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchMetrics());
  }, [dispatch]);

  if (isLoading) return <PageLoader />;
  if (error) return <div>Помилка: {error}</div>;
  if (!metrics) return null;

  const isHRMetrics = metrics && "metrics_summary" in metrics;

  if (!isHRMetrics) {
    return <div>Помилка: отримано некоректні дані для HR дашборду</div>;
  }

  return (
    <>
      <PageHeader title="Огляд" showLogo />
      <MetricSummaryList metricsSummary={metrics.metrics_summary} />

      <div className="flex flex-col xl:flex-row gap-4 mt-4 w-full items-stretch xl:h-[560px]">
        <div className="w-full xl:w-1/2 flex flex-col min-h-0">
          <div className="flex-1 w-full max-h-[500px] xl:max-h-none flex flex-col">
            <MetricsHistoryList metricsHistory={metrics.metrics_history} />
          </div>
        </div>

        <div className="w-full xl:w-1/2 flex flex-col gap-4 min-h-0">
          <div>
            <SurveyCompletionTable data={metrics.engagement} />
          </div>

          <div className="flex-1 flex flex-col min-h-[300px] xl:min-h-0">
            <WorkloadChart data={metrics.workload_current} />
          </div>
        </div>
      </div>
    </>
  );
};
