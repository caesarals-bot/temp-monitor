import { Link, useNavigate } from "react-router";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function RegisterPage() {
    const { register } = useApp();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fullName = `${firstName} ${lastName}`.trim();
            await register(email, password, fullName);
            toast.success("Cuenta creada exitosamente. ¡Bienvenido!");
            // Redirigir a onboarding para configurar restaurante
            navigate("/onboarding");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
                <CardDescription>
                    Registra tu restaurante para comenzar a monitorear
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">Nombre</Label>
                            <Input
                                id="first-name"
                                placeholder="Juan"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Apellido</Label>
                            <Input
                                id="last-name"
                                placeholder="Pérez"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nombre@restaurante.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="px-0">
                <p className="text-sm text-muted-foreground w-full text-center">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
