import { useNavigate } from "react-router";
import { RestaurantForm } from "@/components/admin/RestaurantForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export function OnboardingPage() {
    const navigate = useNavigate();
    const { logout, currentUser } = useApp();

    const handleSuccess = () => {
        // Al crear el primer restaurante, redirigir al dashboard
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {currentUser?.name}!</h1>
                    <p className="text-gray-500">
                        Para comenzar, necesitamos crear tu primer restaurante.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Datos del Restaurante</CardTitle>
                        <CardDescription>
                            Esta será la sucursal principal. Podrás agregar más tarde.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RestaurantForm onSuccess={handleSuccess} />
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Button variant="ghost" className="text-muted-foreground" onClick={() => { logout(); navigate("/login"); }}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Cancelar y Cerrar Sesión
                    </Button>
                </div>
            </div>
        </div>
    );
}
