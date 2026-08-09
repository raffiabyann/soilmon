import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/app/ThemeProvider";
import { AutoRefreshProvider } from "@/app/AutoRefreshProvider";
import { Layout } from "@/app/Layout";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { DataHistoryPage } from "@/app/pages/DataHistoryPage";
import { AlertsPage } from "@/app/pages/AlertsPage";
import { ReportsPage } from "@/app/pages/ReportsPage";
import { SettingsPage } from "@/app/pages/SettingsPage";
import { NotFoundPage } from "@/app/pages/NotFoundPage";

/**
 * SoilMon application root.
 *
 * AutoRefreshProvider wraps the tree so both Header and SidebarStatus
 * share the same enabled/lastSyncTime state without prop drilling.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AutoRefreshProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/data-history" element={<DataHistoryPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </AutoRefreshProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
