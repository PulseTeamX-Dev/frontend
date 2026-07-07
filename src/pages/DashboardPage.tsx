import { HRDashboard } from "@/features/dashboard/ui/HRDashboard";
import { TLDashboard } from "@/features/dashboard/ui/TLDashboard";
import PageLayout from "@/app/layout/PageLayout";
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
