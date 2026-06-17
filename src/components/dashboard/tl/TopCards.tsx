import type {
  EngagementCard,
  TopCardMetric,
} from "../../../redux/dashboard/types";
import { Title } from "../../../shared/Title";
import type { HRWorkloadCurrent } from "../../../types/dashboard/types";
import { WorkloadChart } from "../hr/WorkloadChart";
import { TrendCard } from "./TrendCard";

interface TopCardsProps {
  engagement: EngagementCard;
  trust: TopCardMetric;
  stress: TopCardMetric;
  workload: HRWorkloadCurrent[];
}

export const TopCards = ({
  engagement,
  trust,
  stress,
  workload,
}: TopCardsProps) => {
  const RADIUS = 42;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset =
    CIRCUMFERENCE - (engagement.pct / 100) * CIRCUMFERENCE;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full items-stretch">
      {/* КАРТКА 1: ВІДСОТОК ВІДПОВІДЕЙ */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
        <Title tag="h2" variant="light">
          Відсоток відповідей
        </Title>
        <div className="flex items-center justify-center gap-6 flex-grow my-4">
          <div className="relative w-[88px] h-[88px] shrink-0">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                className="stroke-gray-100"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                className="stroke-success transition-all duration-500 ease-out"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[16px] font-bold text-success">
              {engagement.pct}%
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] text-grayscale-900">Відповіло</span>
            <div className="text-[20px] font-bold text-grayscale-900">
              {engagement.responded}
              <span className="text-grayscale-700 text-sm">
                /{engagement.total_sent}
              </span>
            </div>
          </div>
        </div>

        {/* Невидимий блок для вирівнювання з текстом TrendCard */}
        <div className="text-[11px] text-center font-normal opacity-0 select-none">
          spacer
        </div>
      </div>

      <TrendCard
        title="Рівень довіри"
        trend={trust.trend}
        criticalText="Критичне падіння довіри"
        criticalThreshold={-2}
      />

      <TrendCard
        title="Рівень стресу"
        trend={stress.trend}
        isInverseMetric={true}
        criticalText="Критичне збільшення стресу"
        criticalThreshold={2}
      />

      <div className="h-full">
        <WorkloadChart data={workload} />
      </div>
    </div>
  );
};
