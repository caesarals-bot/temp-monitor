import { BrowserRouter, Routes, Route } from "react-router"; // V7 usa 'react-router'
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { EquipmentPage } from "@/pages/admin/EquipmentPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AppProvider } from "@/context/AppContext";

function TempMonitorApp() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default TempMonitorApp;
