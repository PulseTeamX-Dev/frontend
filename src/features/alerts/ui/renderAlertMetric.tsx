import type { Alert } from "@/features/alerts/model/types";

export const renderMetric = (alert: Alert) => {
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
