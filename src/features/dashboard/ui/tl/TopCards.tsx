import type {
  EngagementCard,
  TopCardMetric,
} from "@/features/dashboard/model/types";
import { Title } from "@/shared/ui/Title";
import type { HRWorkloadCurrent } from "@/features/dashboard/model/hrAnalyticsTypes";
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 w-full xl:h-50 items-stretch">
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full xl:col-span-1">
        <Title
          tag="h2"
          variant="light"
          className="mb-2 text-[15px] md:text-base"
        >
          Відсоток відповідей
        </Title>
        <div className="flex items-center justify-center gap-6 flex-grow my-1">
          {/* Збільшили контейнер з 68px до 120px (або 100px, залежно від макета) */}
          <div className="relative w-[100px] h-[100px] shrink-0">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Сіра підкладка */}
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                className="stroke-gray-100"
                strokeWidth="6" /* Трохи тонша лінія для витонченості */
                fill="transparent"
              />
              {/* Кольоровий прогрес */}
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                className="stroke-success transition-all duration-500 ease-out"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[20px] font-bold font-font-heading text-success tracking-tight">
              {engagement.pct}%
            </span>
          </div>

          {/* Права частина з текстом теж потребує більших шрифтів відповідно до макета */}
          <div className="flex flex-col gap-1">
            <span className="text-[14px] text-grayscale-900 font-medium">
              Відповіло
            </span>
            <div className="text-[24px] font-bold text-grayscale-900 leading-none flex items-baseline">
              {engagement.responded}
              <span className="text-grayscale-700 text-[14px] font-semibold ml-1">
                /{engagement.total_sent}
              </span>
            </div>
          </div>
        </div>
        <div className="text-[10px] text-center font-normal opacity-0 select-none">
          spacer
        </div>
      </div>

      <div className="xl:col-span-1">
        <TrendCard
          title="Рівень довіри"
          trend={trust.trend}
          criticalText="Критичне падіння довіри"
          criticalThreshold={-2}
        />
      </div>

      <div className="md:col-span-1 xl:col-span-1">
        <TrendCard
          title="Рівень стресу"
          trend={stress.trend}
          isInverseMetric={true}
          criticalText="Критичне збільшення стресу"
          criticalThreshold={2}
        />
      </div>

      <div className="md:col-span-1 xl:col-span-2 flex flex-col h-full ">
        <WorkloadChart data={workload} />
      </div>
    </div>
  );
};
