import type { Alert } from "@/features/alerts/model/types";
import Icon from "@/shared/ui/Icon";
import { renderMetric } from "@/shared/lib/renderAlertMetric";
import alertIcon from "../../assets/icons/alert.svg";

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onResolve: (id: number) => void;
}

const AlertsModal = ({
  isOpen,
  onClose,
  alerts,
  onResolve,
}: AlertsModalProps) => {
  if (!isOpen) return null;

  const unresolvedCount = alerts.filter((alert) => !alert.resolved_at).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="w-full max-w-[420px] h-full overflow-y-auto bg-white shadow-xl">
        <div className="border-b p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl leading-6 font-light text-grayscale-900">
                Сигнали
              </h2>

              <div className="mt-1 flex items-center gap-2">
                <img
                  src={alertIcon}
                  alt="Alert"
                  className="w-5 h-5 flex-shrink-0"
                />
                <p className="mt-1 text-base leading-6 font-normal text-[#ED2B26]">
                  {unresolvedCount} сигналів не розглянуто
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <Icon id="close" className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          {alerts.length === 0 ? (
            <div className="py-8 text-center text-gray-500">Немає сигналів</div>
          ) : (
            alerts.map((alert) => {
              const isResolved = Boolean(alert.resolved_at);

              return (
                <div key={alert.alert_id} className="relative group">
                  <div
                    className={`flex min-h-[160px] flex-col rounded-3xl border p-5 transition-all ${
                      isResolved
                        ? "border-gray-200 bg-gray-50 opacity-60"
                        : "border-gray-200 bg-white hover:shadow-md"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {!isResolved && (
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#ED2B2633] p-[2px] flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-[#ED2B26]" />
                          </div>
                        )}

                        <span className="text-sm text-gray-500">
                          {new Date(alert.created_at).toLocaleDateString(
                            "uk-UA",
                          )}
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
                            className="absolute h-8 w-8 opacity-0 cursor-pointer"
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

                    <div className="mb-2 text-gray-500">{alert.team_name}</div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-base">
                        {alert.alert_type_label}
                      </div>

                      {renderMetric(alert)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsModal;
