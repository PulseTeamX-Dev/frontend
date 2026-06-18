import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../hooks/useReduxTypes";

import {
  fetchAlerts,
  resolveAlert,
  fetchAlertsAnalytics,
} from "../redux/alerts/operation";
import {
  selectAlerts,
  selectAlertsLoading,
  selectUnresolvedAlertsCount,
  selectAlertsAnalytics,
} from "../redux/alerts/selectors";

import AlertCard from "../components/alerts/AlertCard";
import SignalsAnalytics from "../components/alerts/SignalsAnalytics";
import Icon from "../shared/Icon";
import { Title } from "../shared/Title";

export const SignalsPage = () => {
  const dispatch = useAppDispatch();

  const alerts = useAppSelector(selectAlerts);
  const loading = useAppSelector(selectAlertsLoading);
  const unresolvedCount = useAppSelector(selectUnresolvedAlertsCount);
  const analytics = useAppSelector(selectAlertsAnalytics);

  useEffect(() => {
    dispatch(fetchAlerts());
    dispatch(fetchAlertsAnalytics());
  }, [dispatch]);

  const handleResolve = async (alertId: number) => {
    try {
      await dispatch(resolveAlert(alertId)).unwrap();

      toast.success("Сигнал позначено як вирішений");
    } catch {
      toast.error("Не вдалося закрити сигнал");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4 mb-8">
        <Icon id="logo" className="w-8 h-8" />

        <Title
          tag="h1"
          variant="bold"
          className="text-[18px] text-grayscale-900"
        >
          Інсайти HR
        </Title>

        <div className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium">
          {unresolvedCount} сигналів не розглянуто
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Завантаження...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.alert_id}
              alert={alert}
              onResolve={handleResolve}
            />
          ))}
        </div>
      )}

      {analytics && (
        <SignalsAnalytics
          alertsResolution={analytics.alerts_resolution}
          retentionHr={analytics.retention_hr}
          retentionTeamLead={analytics.retention_team_lead}
        />
      )}
    </div>
  );
};
