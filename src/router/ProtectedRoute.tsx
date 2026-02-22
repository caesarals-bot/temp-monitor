import { Navigate, Outlet, useLocation } from "react-router";
import { useApp } from "@/context/AppContext";
import { supabase } from "@/lib/supabase";

export function ProtectedRoute() {
    const { currentUser, userRestaurants, isLoading, isDataLoaded, globalError } = useApp();
    const location = useLocation();

    // Show loading spinner if auth is still validating OR if we have a user but their data hasn't loaded yet.
    if (isLoading || (currentUser && !isDataLoaded && !globalError)) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Mostrar un error de red o timeout
    if (globalError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4 text-center">
                <div className="animate-pulse mb-4 text-orange-500">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Problemas de Conexión</h2>
                <p className="text-gray-600 mb-6 max-w-md">{globalError}</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                        Reintentar
                    </button>
                    <button
                        onClick={async () => {
                            // Opcional: Cerrar sesión en caso de un error colosal
                            await supabase.auth.signOut();
                            window.location.href = '/login';
                        }}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                    >
                        Salir
                    </button>
                </div>
            </div>
        );
    }


    if (!currentUser) return <Navigate to="/login" replace />;

    // Si el usuario está logueado pero no tiene restaurantes, y no está en /onboarding, redirigir
    // La redirección SOLO sucede si la data cargó correctamente y el restaurante sigue siendo cero.
    if (isDataLoaded && userRestaurants.length === 0 && location.pathname !== "/onboarding") {
        return <Navigate to="/onboarding" replace />;
    }

    // Si ya tiene restaurantes y trata de entrar a onboarding, mandar a dashboard
    if (userRestaurants.length > 0 && location.pathname === "/onboarding") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
