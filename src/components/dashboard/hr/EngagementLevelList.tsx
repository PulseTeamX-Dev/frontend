import type { EngagementData } from "../../../types/dashboard/types";
import { getBadgeClass } from "../../../utils/getBadgeClass";

interface EngagementLevelListProps {
  data: EngagementData[];
}

export const EngagementLevelList = ({ data }: EngagementLevelListProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full">
      <h2 className="text-[20px] text-grayscale-900 font-light font-heading leading-tight mb-5">
        Рівень залученості
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {data.map((item) => (
          <div
            key={`eng_${item.team_id}`}
            className="flex justify-between items-center border-b md:border-none border-gray-50 pb-2 md:pb-0 last:border-0"
          >
            <span className="text-[16px] text-grayscale-900">
              {item.team_name}
            </span>
            <span
              className={`px-2 py-2.5 rounded-lg text-xs font-semibold ${getBadgeClass(
                item.response_rate_pct,
              )}`}
            >
              {item.response_rate_pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
