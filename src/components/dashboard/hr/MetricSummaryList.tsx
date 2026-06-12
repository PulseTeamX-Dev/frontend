import type { HRMetricsSummaryContainer } from "../../../types/dashboard/types";
import { MetricsSummaryItems } from "./MetricsSummaryItems";

interface MetricSummaryProps {
  metricsSummary: HRMetricsSummaryContainer;
}

const metricConfig: Record<
  keyof HRMetricsSummaryContainer,
  { title: string; prefix: string; isPercentage: boolean }
> = {
  response_rate: {
    title: "Відсоток відповідей",
    prefix: "Найменший",
    isPercentage: true,
  },
  conflict_risk: {
    title: "Ризик конфлікту",
    prefix: "Найбільший",
    isPercentage: false,
  },
  burnout_risk: {
    title: "Ризик вигорання",
    prefix: "Найбільший",
    isPercentage: false,
  },
  safety_feeling: {
    title: "Відчуття безпеки",
    prefix: "Найменший",
    isPercentage: false,
  },
  anonymity_trust: {
    title: "Довіра анонімності",
    prefix: "Найменший",
    isPercentage: true,
  },
  critical_overload: {
    title: "Перевантаженість",
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
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
