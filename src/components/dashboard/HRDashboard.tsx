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
      <div className="flex gap-2 items-center">
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

      <div className="flex flex-col xl:flex-row gap-5 mt-6 w-full items-stretch xl:h-[560px]">
        {/* ЛІВА КОЛОНКА (Хітмеп) - 1/2 */}
        <div className="w-full xl:w-1/2 flex flex-col min-h-0">
          <MetricsHistoryList metricsHistory={metrics.metrics_history} />
        </div>

        {/* ПРАВА КОЛОНКА (Картки) - 1/2 */}
        <div className="w-full xl:w-1/2 flex flex-col gap-5 min-h-0">
          {/* ФІКС ВІЗУАЛУ: Картка опитувань займає фіксовано ~40% або контентну висоту */}
          <div className="flex-none">
            <SurveyCompletionTable data={metrics.engagement} />
          </div>

          <div className="flex-1 flex flex-col">
            <WorkloadChart data={metrics.workload_current} />
          </div>
        </div>
      </div>
    </>
  );
};
