import { useMemo } from "react";
import Icon from "@/shared/ui/Icon";
import { Title } from "@/shared/ui/Title";
import type { EngagementData } from "@/features/dashboard/model/hrAnalyticsTypes";

interface SurveyCompletionTableProps {
  data: EngagementData[];
}

const getBadgeStyles = (pct: number, isCritical: boolean) => {
  if (isCritical || pct < 30) {
    return "bg-red-50 text-red-600 border border-red-100";
  }
  if (pct >= 70) {
    return "bg-green-50 text-green-700 border border-green-100";
  }
  return "bg-yellow-50 text-yellow-700 border border-yellow-100";
};

export const SurveyCompletionTable = ({ data }: SurveyCompletionTableProps) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a.low_engagement_signal && !b.low_engagement_signal) return -1;
      if (!a.low_engagement_signal && b.low_engagement_signal) return 1;
      return a.response_rate_pct - b.response_rate_pct;
    });
  }, [data]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full flex flex-col min-h-0 shrink-0">
      <Title tag="h2" variant="light" className="mb-4 shrink-0">
        Стан заповнення опитувань
      </Title>

      <div className="w-full overflow-x-auto overflow-y-hidden pb-3 custom-scrollbar h-[130px] flex-1 flex">
        <div className="flex gap-2 justify-start my-auto mx-auto flex-nowrap">
          {sortedData.map((item) => {
            const isCritical = item.low_engagement_signal;

            return (
              <div
                key={item.team_id}
                className="relative w-[132px] border border-gray-100 rounded-xl p-3 flex flex-col gap-y-1 pt-1 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] h-[112px] shrink-0"
              >
                {isCritical && (
                  <div className="absolute top-2 left-3 flex items-center gap-1 text-error select-none">
                    <Icon id="circle-warning-filled" className="w-3.5 h-3.5" />
                    <span className="text-[12px]">Критично</span>
                  </div>
                )}

                {/* Середня частина (Дріб + бадж) */}
                <div className="flex justify-between items-baseline w-full mt-auto">
                  <div className="">
                    <span className="text-grayscale-900 text-[24px] font-light">
                      {item.responses}
                    </span>
                    <span className="text-grayscale-700 text-[16px] ml-0.5">
                      /{item.total_sent}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getBadgeStyles(item.response_rate_pct, isCritical)}`}
                  >
                    {Math.round(item.response_rate_pct)}%
                  </span>
                </div>

                {/* Нижня частина (Назва команди) */}
                <span
                  className="text-[16px] text-grayscale-900 truncate"
                  title={item.team_name}
                >
                  {item.team_name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
