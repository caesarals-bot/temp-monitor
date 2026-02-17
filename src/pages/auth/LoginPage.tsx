import { useNavigate, Link } from "react-router";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function LoginPage() {
    const { login } = useApp();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success("Bienvenido de vuelta");
            navigate("/dashboard");
        } catch (error: any) {
            console.error(error);
            if (error.message.includes("Email not confirmed")) {
                toast.error("Por favor revisa tu correo y confirma tu cuenta antes de ingresar.", {
                    duration: 5000,
                });
            } else {
                toast.error(error.message || "Error al iniciar sesión");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-none bg-transparent">
            {/* ... Header ... */}
            <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
                <CardDescription>
                    Ingresa tus credenciales para acceder a la plataforma.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... Email Input ... */}
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
                    {/* ... Password Input ... */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Contraseña</Label>
                            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? "Ingresando..." : "Ingresar"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="px-0">
                <p className="text-sm text-muted-foreground w-full text-center">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register" className="font-medium text-primary hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
