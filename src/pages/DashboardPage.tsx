import { HRDashboard } from "../components/dashboard/HRDashboard";
import { TLDashboard } from "../components/dashboard/TLDashboard";
import PageLayout from "../components/layout/PageLayout";
import { useAppSelector } from "@/app/useReduxTypes";

export const DashboardPage = () => {
  const role = useAppSelector((state) => state.auth.role);

  if (role === "hr") {
    return (
      <PageLayout>
        <HRDashboard />
      </PageLayout>
    );
  }

  if (role === "team_lead") {
    return (
      <PageLayout>
        <TLDashboard />
      </PageLayout>
    );
  }
};
