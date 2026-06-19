import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypes";
import { fetchMetrics } from "../../redux/dashboard/operation";
import { MetricSummaryList } from "./hr/MetricSummaryList";
import MetricsHistoryList from "./hr/MetricsHistoryList";
import { SurveyCompletionTable } from "./hr/SurveyCompletionTable";
import { WorkloadChart } from "./hr/WorkloadChart";
import Icon from "../../shared/Icon";
import { Title } from "../../shared/Title";

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
      <div className="flex gap-2 items-center mb-5 mt-1">
        <Icon
          id="logo"
          className="w-8 h-8 text-primary-active shrink-0 transform -translate-y-1.25"
        />
        <Title
          tag="h1"
          variant="light"
          className="text-[18px] md:text-xl text-grayscale-900 font-heading mb-0 leading-none"
        >
          Огляд
        </Title>
      </div>

      <MetricSummaryList metricsSummary={metrics.metrics_summary} />

      <div className="flex flex-col xl:flex-row gap-4 mt-6 w-full items-stretch">
        <div className="w-full xl:w-7/12 flex flex-col">
          <MetricsHistoryList metricsHistory={metrics.metrics_history} />
        </div>
        <div className="w-full xl:w-5/12 flex flex-col gap-4">
          <SurveyCompletionTable data={metrics.engagement} />
          <WorkloadChart data={metrics.workload_current} />
        </div>
      </div>

      {/* <pre>{JSON.stringify(metrics, null, 2)}</pre> */}
    </>
  );
};
