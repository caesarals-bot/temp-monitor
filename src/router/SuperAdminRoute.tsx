import { Navigate, Outlet } from "react-router";
import { useApp } from "@/context/AppContext";

export function SuperAdminRoute() {
    const { currentUser, isLoading, isDataLoaded } = useApp();

    if (isLoading || (currentUser && !isDataLoaded)) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!currentUser) return <Navigate to="/login" replace />;

    // Solo permitir acceso a usuarios marcados como platform_admin
    if (!currentUser.is_platform_admin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
