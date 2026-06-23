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
import { PageLoader } from "../shared/Loader";
import { PageHeader } from "../shared/PageHeader";

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
      dispatch(fetchAlerts());
      dispatch(fetchAlertsAnalytics());

      toast.success("Сигнал позначено як вирішений");
    } catch {
      toast.error("Не вдалося закрити сигнал");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-6">
      <PageHeader
        title="Інсайти HR"
        showLogo={true}
        rightContent={
          <div className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium">
            {unresolvedCount} сигналів не розглянуто
          </div>
        }
      />

      {analytics && (
        <>
          <SignalsAnalytics
            alertsResolution={analytics.alerts_resolution}
            retentionHr={analytics.retention_hr}
            retentionTeamLead={analytics.retention_team_lead}
          />
          <div className="my-4 border-t border-gray-200" />
        </>
      )}

      {loading ? (
        <PageLoader />
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
    </div>
  );
};
