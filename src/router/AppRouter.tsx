import { Routes, Route, Navigate } from "react-router";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { EquipmentPage } from "@/pages/admin/EquipmentPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { StaffPage } from "@/pages/admin/StaffPage";
import { ProfilePage } from "@/pages/admin/ProfilePage";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { OnboardingPage } from "@/pages/auth/OnboardingPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
    return (
        <Routes>
            {/* Ruta raíz redirige a Login por defecto */}
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
                    <Route path="staff" element={<StaffPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Route>
        </Routes>
    );
};
