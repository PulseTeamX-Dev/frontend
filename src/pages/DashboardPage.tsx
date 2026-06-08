import { HRDashboard } from "../components/dashboard/HRDashboard";
import { TLDashboard } from "../components/dashboard/TLDashboard";
import { useAppSelector } from "../hooks/useReduxTypes";

export const DashboardPage = () => {
  const role = useAppSelector((state) => state.auth.role);

  if (role === "hr") {
    return <HRDashboard />;
  }

  if (role === "team_lead") {
    return <TLDashboard />;
  }
};
