import type { Alert } from "../../redux/alerts/types";
import Icon from "../../shared/Icon";

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
}

const AlertsModal = ({ isOpen, onClose, alerts }: AlertsModalProps) => {
  if (!isOpen) return null;

  const unresolvedCount = alerts.filter((alert) => !alert.is_resolved).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="w-full max-w-[420px] bg-white h-full overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-xl font-semibold">Сигнали</h2>

            <p className="text-sm text-red-500 mt-1">
              {unresolvedCount} сигналів не розглянуті
            </p>
          </div>

          <button onClick={onClose}>
            <Icon id="close" className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="rounded-2xl border p-4">
              <div className="flex justify-between mb-3">
                <span className="text-xs text-gray-500">
                  {new Date(alert.created_at).toLocaleDateString("uk-UA")}
                </span>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={alert.is_resolved} readOnly />

                  <span className="text-sm">Вирішено</span>
                </label>
              </div>

              <div className="text-sm text-gray-500 mb-2">
                {alert.team_name}
              </div>

              <div className="font-medium">{alert.alert_type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsModal;
