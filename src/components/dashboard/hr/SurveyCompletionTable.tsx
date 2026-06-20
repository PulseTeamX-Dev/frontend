import { useMemo } from "react";
import Icon from "../../../shared/Icon";
import { Title } from "../../../shared/Title";
import type { EngagementData } from "../../../types/dashboard/types";
import { getBadgeClass } from "../../../utils/getBadgeClass";

interface SurveyCompletionTableProps {
  data: EngagementData[];
}

export const SurveyCompletionTable = ({ data }: SurveyCompletionTableProps) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      if (a.low_engagement_signal && !b.low_engagement_signal) return -1;
      if (!a.low_engagement_signal && b.low_engagement_signal) return 1;
      return a.response_rate_pct - b.response_rate_pct;
    });
  }, [data]);

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 w-full flex-1 flex flex-col min-h-[180px]">
      <Title tag="h2" variant="light" className="mb-3 shrink-0">
        Стан заповнення опитувань
      </Title>

      <div className="w-full flex-1 overflow-y-auto overflow-x-auto min-h-0 pb-1 pr-1 custom-scrollbar">
        <div className="min-w-[360px]">
          {/* Липкий Заголовок */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 mb-3 text-grayscale-500 font-medium text-[12px] md:text-[13px] text-center sticky top-0 bg-white z-10 pb-2 border-b border-gray-50">
            <div className="text-left"></div>
            <div>Надіслано</div>
            <div>Відповіли</div>
            <div>Відсоток</div>
          </div>

          {/* Рядки */}
          <div className="flex flex-col gap-3 md:gap-4 mt-1">
            {sortedData.map((item) => (
              <div
                key={item.team_id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 items-center border-b border-gray-50 pb-2.5 last:border-0 last:pb-0"
              >
                <div className="text-left flex flex-col justify-center">
                  {item.low_engagement_signal && (
                    <div className="flex items-center gap-1 mt-0.5 text-error">
                      <Icon
                        id="circle-warning-filled"
                        className="w-3.5 h-3.5"
                      />
                      <span className="text-[11px] font-medium leading-none">
                        Критично
                      </span>
                    </div>
                  )}
                  <span className="text-[14px] md:text-[15px] text-grayscale-900 font-medium truncate pr-2">
                    {item.team_name}
                  </span>
                </div>

                <div className="text-center text-[14px] md:text-[15px] text-grayscale-900 font-semibold">
                  {item.total_sent}
                </div>
                <div className="text-center text-[14px] md:text-[15px] text-grayscale-900 font-semibold">
                  {item.responses}
                </div>

                <div className="flex justify-center">
                  <span
                    className={`w-13 px-2 py-1 md:py-1.5 rounded-lg text-[11px] text-center md:text-xs font-bold ${getBadgeClass(item.response_rate_pct)}`}
                  >
                    {item.response_rate_pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
