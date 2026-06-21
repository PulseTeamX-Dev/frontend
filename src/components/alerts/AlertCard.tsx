import type { Alert } from "../../redux/alerts/types";

interface Props {
  alert: Alert;
  onResolve: (id: number) => void;
}

const renderMetric = (alert: Alert) => {
  if (alert.metric_value === null) return null;

  const value = Number(alert.metric_value).toFixed(1);
  const badgeClass =
    "min-w-[80px] text-center px-3 py-1 rounded-xl font-semibold text-sm";

  switch (alert.alert_type) {
    case "stress_high": //'Високий стрес'
    case "stress_warning": //'Зростання рівня тривожності'
      return (
        <div
          className={` ${
            alert.alert_level === "CRITICAL"
              ? `${badgeClass} bg-red-50 text-red-600`
              : `${badgeClass} bg-orange-50 text-orange-500`
          }`}
        >
          {value} / 10
        </div>
      );

    case "stress_spike": //'Різкий стрибок стресу'
      return (
        <div className={`${badgeClass} bg-red-50 text-red-600`}>+{value} ↑</div>
      );

    case "trust_drop": //'Зниження довіри'
      return (
        <div className={`${badgeClass} bg-orange-50 text-orange-500`}>
          -{value} ↓
        </div>
      );

    case "low_engagement": //'Низька залученість команди'
      return (
        <div className={`${badgeClass} bg-yellow-50 text-yellow-600`}>
          {value}%
        </div>
      );

    case "workload_overload": //'Перевантаження'
      return (
        <div className={`${badgeClass} bg-red-50 text-red-600`}>
          {value} / 10
        </div>
      );

    case "workload_underload": //'Недовантаження'
      return (
        <div className={`${badgeClass} bg-sky-50 text-sky-600`}>
          {value} / 10
        </div>
      );

    case "burnout_risk": //'Високий ризик вигорання'
      return (
        <div
          className={` ${
            alert.alert_level === "CRITICAL"
              ? `${badgeClass} bg-red-50 text-red-600`
              : `${badgeClass} bg-orange-50 text-orange-500`
          }`}
        >
          {value} / 10
        </div>
      );

    case "conflict_risk": //'Ризик виникнення конфлікту'
      return (
        <div
          className={` ${
            alert.alert_level === "CRITICAL"
              ? `${badgeClass} bg-orange-100 text-orange-600`
              : `${badgeClass} bg-yellow-50 text-yellow-600`
          }`}
        >
          {value} / 10
        </div>
      );

    default:
      return null;
  }
};

const AlertCard = ({ alert, onResolve }: Props) => {
  const isResolved = !!alert.resolved_at;

  return (
    <div className="relative group">
      <div
        className={`flex flex-col min-h-[160px] bg-white rounded-3xl border border-gray-200 p-5 transition-all hover:shadow-md ${
          isResolved
            ? "bg-gray-50 border-gray-200 opacity-60 text-gray-400"
            : "bg-white border-gray-200 hover:shadow-md"
        }`}
      >
        <div className="flex justify-between mb-4">
          <span className="text-gray-500 text-sm">
            {new Date(alert.created_at).toLocaleDateString("uk-UA")}
          </span>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isResolved}
              disabled={isResolved}
              onChange={() => {
                if (!isResolved) {
                  onResolve(alert.alert_id);
                }
              }}
            />

            <span className="text-gray-500">Вирішено</span>
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
