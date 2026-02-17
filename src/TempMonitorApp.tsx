import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { EquipmentPage } from "@/pages/admin/EquipmentPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { OnboardingPage } from "@/pages/auth/OnboardingPage";
import { AppProvider, useApp } from "@/context/AppContext";

// ... imports

function ProtectedRoute() {
  const { currentUser, userRestaurants, isLoading } = useApp();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  // Si el usuario está logueado pero no tiene restaurantes, y no está en /onboarding, redirigir
  // Nota: Esto asume que userRestaurants se calcula correctamente en el contexto
  // Para el mock inicial, un usuario nuevo tiene userRestaurants vacío.
  if (userRestaurants.length === 0 && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Si ya tiene restaurantes y trata de entrar a onboarding, mandar a dashboard
  if (userRestaurants.length > 0 && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function TempMonitorApp() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta raíz redirige a Login por defecto (o dashboard si hay auth en el futuro) */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas de Autenticación */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="equipment" element={<EquipmentPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default TempMonitorApp;
