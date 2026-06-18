import { useState } from "react";
import type {
  AlertResolution,
  RetentionMetric,
} from "../../redux/alerts/types";
import AlertResolutionChart from "./AlertResolutionChart";
import RetentionChart from "./RetentionChart";

interface Props {
  alertsResolution: AlertResolution[];
  retentionHr: RetentionMetric[];
  retentionTeamLead: RetentionMetric[];
}

const SignalsAnalytics = ({
  alertsResolution,
  retentionHr,
  retentionTeamLead,
}: Props) => {
  const [role, setRole] = useState<"hr" | "team_lead">("team_lead");
  const retentionData = role === "hr" ? retentionHr : retentionTeamLead;

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1.3fr] gap-6 items-start">
        <AlertResolutionChart data={alertsResolution} />
        <RetentionChart data={retentionData} role={role} setRole={setRole} />
      </div>
    </div>
  );
};

export default SignalsAnalytics;
