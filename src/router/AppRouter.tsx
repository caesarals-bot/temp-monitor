
import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { PageSpinner } from "@/components/ui/spinner";

// Lazy loaded pages with named exports adaptation
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage").then(module => ({ default: module.DashboardPage })));
const EquipmentPage = lazy(() => import("@/pages/admin/EquipmentPage").then(module => ({ default: module.EquipmentPage })));
const SettingsPage = lazy(() => import("@/pages/admin/SettingsPage").then(module => ({ default: module.SettingsPage })));
const StaffPage = lazy(() => import("@/pages/admin/StaffPage").then(module => ({ default: module.StaffPage })));
const ReportsPage = lazy(() => import("@/pages/reports/ReportsPage").then(module => ({ default: module.ReportsPage })));
const ProfilePage = lazy(() => import("@/pages/admin/ProfilePage").then(module => ({ default: module.ProfilePage })));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage").then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage").then(module => ({ default: module.RegisterPage })));
const OnboardingPage = lazy(() => import("@/pages/auth/OnboardingPage").then(module => ({ default: module.OnboardingPage })));

// Super Admin Pages
const PlatformDashboard = lazy(() => import("@/pages/admin/PlatformDashboard").then(m => ({ default: m.PlatformDashboard })));
const OrganizationsManager = lazy(() => import("@/pages/admin/OrganizationsManager").then(m => ({ default: m.OrganizationsManager })));
const UsersManager = lazy(() => import("@/pages/admin/UsersManager").then(m => ({ default: m.UsersManager })));
import { SuperAdminRoute } from "./SuperAdminRoute";
import { SuperAdminLayout } from "@/layouts/SuperAdminLayout";

export const AppRouter = () => {
    return (
        <Suspense fallback={<PageSpinner />}>
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
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="settings" element={<SettingsPage />} />
                    </Route>
                </Route>

                {/* Rutas de Super Admin (Plataforma) */}
                <Route path="/admin" element={<SuperAdminRoute />}>
                    <Route element={<SuperAdminLayout />}>
                        <Route index element={<PlatformDashboard />} />
                        <Route path="organizations" element={<OrganizationsManager />} />
                        <Route path="users" element={<UsersManager />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
};
