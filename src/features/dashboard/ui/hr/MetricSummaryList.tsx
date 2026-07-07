import type { HRMetricsSummaryContainer } from "@/features/dashboard/model/hrAnalyticsTypes";
import { MetricsSummaryItems } from "./MetricsSummaryItems";

interface MetricSummaryProps {
  metricsSummary: HRMetricsSummaryContainer;
}

const metricConfig: Record<
  keyof HRMetricsSummaryContainer,
  { title: string; prefix: string; isPercentage: boolean }
> = {
  response_rate: {
    title: "Активність",
    prefix: "MIN",
    isPercentage: true,
  },
  conflict_risk: {
    title: "Ризик конфлікту",
    prefix: "MAX",
    isPercentage: false,
  },
  burnout_risk: {
    title: "Ризик вигорання",
    prefix: "MAX",
    isPercentage: false,
  },
  safety_feeling: {
    title: "Відчуття безпеки",
    prefix: "MIN",
    isPercentage: false,
  },
  anonymity_trust: {
    title: "Індекс анонімності",
    prefix: "MIN",
    isPercentage: true,
  },
  critical_overload: {
    title: "Перевантаження",
    prefix: "",
    isPercentage: true,
  },
};

export const MetricSummaryList = ({ metricsSummary }: MetricSummaryProps) => {
  const metricsArray = Object.entries(metricsSummary) as [
    keyof HRMetricsSummaryContainer,
    HRMetricsSummaryContainer[keyof HRMetricsSummaryContainer],
  ][];

  return (
    // ФІКС: Змінили lg:grid-cols-6 на xl:grid-cols-6
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
      {metricsArray.map(([key, data]) => {
        const config = metricConfig[key];

        return (
          <div key={key}>
            <MetricsSummaryItems
              title={config.title}
              prefix={config.prefix}
              isPercentage={config.isPercentage}
              score={data.score}
              trend={data.trend}
              worstTeam={data.worst_team}
            />
          </div>
        );
      })}
    </div>
  );
};
