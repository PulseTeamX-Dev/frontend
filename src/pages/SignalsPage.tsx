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
import { PageLoader } from "@/shared/ui/Loader";
import { PageHeader } from "@/shared/ui/PageHeader";
import { selectAuthRole } from "../redux/auth/selectors";
import alertIcon from "../assets/icons/alert.svg";

const roleLabels: Record<string, string> = {
  hr: "HR",
  team_lead: "Тімліда",
  admin: "Адміна",
};

const getSignalsWord = (count: number) => {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return "сигналів";
  }

  if (last === 1) {
    return "сигнал";
  }

  if (last >= 2 && last <= 4) {
    return "сигнали";
  }

  return "сигналів";
};

export const SignalsPage = () => {
  const dispatch = useAppDispatch();

  const alerts = useAppSelector(selectAlerts);
  const loading = useAppSelector(selectAlertsLoading);
  const unresolvedCount = useAppSelector(selectUnresolvedAlertsCount);
  const analytics = useAppSelector(selectAlertsAnalytics);
  const role = useAppSelector(selectAuthRole);

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

  const displayRole = role
    ? roleLabels[role.toLowerCase()] || role.toUpperCase()
    : "";

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-6">
      <PageHeader
        title={`Інсайти ${displayRole}`}
        showLogo={true}
        rightContent={
          <div className="mt-1 flex items-center gap-2">
            <img
              src={alertIcon}
              alt="Alert"
              className="w-5 h-5 flex-shrink-0"
            />

            <p className="mt-1 text-base leading-6 font-normal text-[#ED2B26]">
              {unresolvedCount} {getSignalsWord(unresolvedCount)} не розглянуто
            </p>
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
