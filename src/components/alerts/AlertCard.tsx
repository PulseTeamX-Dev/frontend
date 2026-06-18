import type { Alert } from "../../redux/alerts/types";

interface Props {
  alert: Alert;
  onResolve: (id: number) => void;
}

const AlertCard = ({ alert, onResolve }: Props) => {
  const isResolved = !!alert.resolved_at;

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200 p-5 transition-all hover:shadow-md ${
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

      <div className="font-semibold text-xl">{alert.alert_type_label}</div>
    </div>
  );
};

export default AlertCard;
