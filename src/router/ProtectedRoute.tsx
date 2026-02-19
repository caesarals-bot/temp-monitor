import { Navigate, Outlet, useLocation } from "react-router";
import { useApp } from "@/context/AppContext";

export function ProtectedRoute() {
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
    if (userRestaurants.length === 0 && location.pathname !== "/onboarding") {
        return <Navigate to="/onboarding" replace />;
    }

    // Si ya tiene restaurantes y trata de entrar a onboarding, mandar a dashboard
    if (userRestaurants.length > 0 && location.pathname === "/onboarding") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
