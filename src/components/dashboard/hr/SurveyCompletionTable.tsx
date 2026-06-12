import Icon from "../../../shared/Icon";
import type { EngagementData } from "../../../types/dashboard/types";
import { getBadgeClass } from "../../../utils/getBadgeClass";

interface SurveyCompletionTableProps {
  data: EngagementData[];
}

export const SurveyCompletionTable = ({ data }: SurveyCompletionTableProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 w-full mb-0 md:mb-4 flex-grow">
      <h2 className="text-[20px] text-gray-900 font-light font-heading leading-tight mb-4">
        Стан заповнення опитувань
      </h2>

      {/* Обертка для скролу на мобільному */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-[400px]">
          {/* Заголовки */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 mb-3 text-grayscale-700 text-[14px] text-center">
            <div className="text-left"></div>
            <div>Надіслано</div>
            <div>Відповіли</div>
            <div>Відсоток</div>
          </div>

          {/* Рядки */}
          <div className="flex flex-col gap-4">
            {data.map((item) => (
              <div
                key={item.team_id}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-2 items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0"
              >
                <div className="text-left flex flex-col justify-center">
                  {item.low_engagement_signal && (
                    <div className="flex items-center gap-1 mt-0.5 text-error">
                      <Icon
                        id="circle-warning-filled"
                        className="w-3.5 h-3.5"
                      />
                      <span className="text-[12px]">Критично</span>
                    </div>
                  )}
                  <span className="text-[15px] md:text-[16px] text-grayscale-900 font-medium">
                    {item.team_name}
                  </span>
                </div>

                <div className="text-center text-[15px] md:text-[16px] text-grayscale-900">
                  {item.total_sent}
                </div>
                <div className="text-center text-[15px] md:text-[16px] text-grayscale-900">
                  {item.responses}
                </div>

                <div className="flex justify-center">
                  <span
                    className={`px-2 py-1.5 md:py-2.5 rounded-lg text-xs font-semibold ${getBadgeClass(item.response_rate_pct)}`}
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
