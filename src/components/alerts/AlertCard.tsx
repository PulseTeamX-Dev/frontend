import type { Alert } from "../../redux/alerts/types";
import { renderMetric } from "../../utils/renderAlertMetric";

interface Props {
  alert: Alert;
  onResolve: (id: number) => void;
}

const AlertCard = ({ alert, onResolve }: Props) => {
  const isResolved = !!alert.resolved_at;

  return (
    <div className="relative group">
      <div
        className={`flex min-h-[160px] flex-col rounded-3xl border p-5 transition-all ${
          isResolved
            ? "border-gray-200 bg-gray-50 opacity-60"
            : "border-gray-200 bg-white hover:shadow-md"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {!isResolved && (
              <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#ED2B2633] p-[2px]">
                <div className="h-2 w-2 rounded-full bg-[#ED2B26]" />
              </div>
            )}

            <span className="text-gray-500 text-sm">
              {new Date(alert.created_at).toLocaleDateString("uk-UA")}
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                isResolved
                  ? "border-[#D9D9D9] bg-[#F5F5F5]"
                  : "border-[#CCCCCC] bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={isResolved}
                disabled={isResolved}
                onChange={() => {
                  if (!isResolved) {
                    onResolve(alert.alert_id);
                  }
                }}
                className="absolute h-8 w-8 cursor-pointer opacity-0"
              />
              {isResolved && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8C8C8C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>

            <span className="text-base font-normal leading-6 text-[#666666]">
              Вирішено
            </span>
          </label>
        </div>

        <div className="text-gray-500 mb-2">{alert.team_name}</div>

        <div className="flex items-start justify-between gap-3">
          <div className="font-semibold text-base">
            {alert.alert_type_label}
          </div>
          {renderMetric(alert)}
        </div>
      </div>
      {alert.resolution_note && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 max-w-xs rounded-xl bg-gray-900 px-3 py-2 text-sm text-white shadow-lg">
          {alert.resolution_note}
        </div>
      )}
    </div>
  );
};

export default AlertCard;
