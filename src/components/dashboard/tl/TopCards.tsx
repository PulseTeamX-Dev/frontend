import type {
  EngagementCard,
  TopCardMetric,
} from "../../../redux/dashboard/types";
import { Title } from "../../../shared/Title";
import { TrendCard } from "./TrendCard";

interface TopCardsProps {
  engagement: EngagementCard;
  trust: TopCardMetric;
  stress: TopCardMetric;
}

export const TopCards = ({ engagement, trust, stress }: TopCardsProps) => {
  const RADIUS = 42; // Збільшили радіус, щоб колечко було більшим
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~263.89
  const strokeDashoffset =
    CIRCUMFERENCE - (engagement.pct / 100) * CIRCUMFERENCE;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-auto">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
        <Title tag="h2" variant="light">
          Відсоток відповідей
        </Title>
        <div className="flex items-center justify-center gap-6 flex-grow mt-2">
          {/* SVG з повністю ВІДЦЕНТРОВАНИМИ координатами */}
          <div className="relative w-[88px] h-[88px] shrink-0">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Сірий круг (центр на 50, 50) */}
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                className="stroke-gray-100"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Зелений круг прогресу (центр на 50, 50) */}
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
            {/* Відсотки тепер СТРОГО ПО ЦЕНТРУ всього SVG */}
            <span className="absolute inset-0 flex items-center justify-center text-[16px] font-bold text-success">
              {engagement.pct}%
            </span>
          </div>

          {/* Текст праворуч від круга */}
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
      </div>

      {/* КАРТКА 2: ДОВІРА АНОНІМНОСТІ (ПЕРЕВИКОРИСТАНО!) */}
      <TrendCard
        title="Довіра анонімності"
        trend={trust.trend}
        criticalText="Критичне падіння довіри"
        criticalThreshold={-2} // Якщо тренд менше або дорівнює -2
      />

      {/* КАРТКА 3: РІВЕНЬ СТРЕСУ (ПЕРЕВИКОРИСТАНО!) */}
      <TrendCard
        title="Рівень стресу"
        trend={stress.trend}
        isInverseMetric={true} // Для стресу: зростання індексу — це погано
        criticalText="Критичне збільшення стресу"
        criticalThreshold={2} // Якщо тренд більше або дорівнює 2
      />
    </div>
  );
};
