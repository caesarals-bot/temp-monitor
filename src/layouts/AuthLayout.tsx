import { Outlet } from "react-router";

export function AuthLayout() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Lado Izquierdo: Formulario */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-sm space-y-6">
                    <Outlet />
                </div>
            </div>

            {/* Lado Derecho: Branding / Imagen (Oculto en móvil) */}
            <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-muted text-muted-foreground border-l border-border">
                <div className="max-w-md text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">TempMonitor</h1>
                    <p className="text-lg">
                        Control total de temperaturas y cumplimiento HACCP para tu restaurante.
                    </p>
                </div>
            </div>
        </div>
    );
}
