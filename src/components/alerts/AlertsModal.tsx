import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Alert } from "../../redux/alerts/types";
import Icon from "../../shared/Icon";

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
}

const AlertsModal = ({ isOpen, onClose, alerts }: AlertsModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const unresolvedCount = alerts.filter((alert) => !alert.resolved_at).length;

  const handleOpenSignals = () => {
    onClose();
    navigate("/signals");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="w-full max-w-[420px] bg-white h-full overflow-y-auto shadow-xl">
        <div className="p-5 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">Сигнали</h2>

              <p className="text-sm text-red-500 mt-1">
                {unresolvedCount} сигналів не розглянуто
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenSignals}
              className="mt-3 px-4 py-2 text-sm rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
            >
              Переглянути всі сигнали
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Icon id="close" className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Немає сигналів</div>
          ) : (
            alerts.map((alert) => {
              const isResolved = Boolean(alert.resolved_at);

              return (
                <div
                  key={alert.alert_id}
                  className={`
                    rounded-2xl
                    border
                    p-4
                    ${
                      isResolved
                        ? "bg-slate-50 border-slate-200"
                        : "bg-white border-gray-200"
                    }
                  `}
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <span className="text-xs text-gray-500">
                      {new Date(alert.created_at).toLocaleDateString("uk-UA")}
                    </span>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isResolved}
                        readOnly
                        onClick={(e) => {
                          e.preventDefault();
                          toast.info(
                            "Для вирішення сигналів перейдіть на сторінку «Сигнали»",
                          );
                        }}
                      />

                      <span className="text-sm text-gray-600">
                        {isResolved ? "Вирішено" : "Не вирішено"}
                      </span>
                    </label>
                  </div>

                  <div className="text-sm text-gray-500 mb-2">
                    {alert.team_name}
                  </div>

                  <div className="font-medium text-grayscale-900">
                    {alert.alert_type_label}
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
