import { KpiRow } from "@/components/dashboard/KpiRow";
import { EnvironmentalOverview } from "@/components/dashboard/EnvironmentalOverview";
import { NodeGrid } from "@/components/dashboard/NodeGrid";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { SystemInformation } from "@/components/dashboard/SystemInformation";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { useDashboardData } from "@/hooks/useDashboardData";

/**
 * Monitoring dashboard content (SPEC §6, §32.1).
 *
 * Stage 4 MVP — all sections rendered with tightened spacing to match
 * the approved reference density. Data comes from the adapter-backed
 * hook (SPEC §22). All values are mock placeholders (SPEC §32.19).
 */
export function Dashboard() {
  const { summary, environmentalSeries, nodes, alerts, systemInfo } =
    useDashboardData();

  return (
    <div className="space-y-6">
      {/* Row 1: KPI summary cards */}
      <KpiRow cards={summary} />

      {/* Row 2: Environmental Overview chart */}
      <EnvironmentalOverview series={environmentalSeries} />

      {/* Row 3: Node status grid — no heading, follows directly */}
      <NodeGrid nodes={nodes} />

      {/* Row 4: Recent Alerts (wider) + System Information — spec: ~60/40 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <RecentAlerts alerts={alerts} />
        <SystemInformation entries={systemInfo} />
      </div>

      {/* Footer attribution */}
      <DashboardFooter />
    </div>
  );
}
