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
  const RADIUS = 32;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset =
    CIRCUMFERENCE - (engagement.pct / 100) * CIRCUMFERENCE;

  return (
    // ІДЕАЛЬНИЙ ФІКС СІТКИ ДЛЯ ПЛАНШЕТА (MD) ТА ДЕСКТОПА (XL)
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 w-full items-stretch">
      {/* КАРТКА 1: ВІДСОТОК ВІДПОВІДЕЙ (Займає 1 колонку всюди) */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full xl:col-span-1">
        <Title
          tag="h2"
          variant="light"
          className="mb-2 text-[15px] md:text-base"
        >
          Відсоток відповідей
        </Title>
        <div className="flex items-center justify-center gap-4 flex-grow my-1">
          <div className="relative w-[68px] h-[68px] shrink-0">
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
            <span className="absolute inset-0 flex items-center justify-center text-[14px] font-bold text-success">
              {engagement.pct}%
            </span>
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-[12px] text-grayscale-900">Відповіло</span>
            <div className="text-[18px] font-bold text-grayscale-900 leading-none">
              {engagement.responded}
              <span className="text-grayscale-700 text-xs font-medium ml-0.5">
                /{engagement.total_sent}
              </span>
            </div>
          </div>
        </div>
        <div className="text-[10px] text-center font-normal opacity-0 select-none">
          spacer
        </div>
      </div>

      {/* КАРТКА 2: ДОВІРА (Займає 1 колонку всюди) */}
      <div className="xl:col-span-1">
        <TrendCard
          title="Рівень довіри"
          trend={trust.trend}
          criticalText="Критичне падіння довіри"
          criticalThreshold={-2}
        />
      </div>

      {/* КАРТКА 3: СТРЕС (ФІКС: на планшеті md:col-span-1, на десктопі xl:col-span-1) */}
      <div className="md:col-span-1 xl:col-span-1">
        <TrendCard
          title="Рівень стресу"
          trend={stress.trend}
          isInverseMetric={true}
          criticalText="Критичне збільшення стресу"
          criticalThreshold={2}
        />
      </div>

      <div className="md:col-span-1 xl:col-span-2 flex flex-col h-full min-h-[140px]">
        <WorkloadChart data={workload} />
      </div>
    </div>
  );
};
