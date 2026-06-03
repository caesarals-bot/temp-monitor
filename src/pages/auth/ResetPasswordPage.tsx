import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Key, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ResetState = "idle" | "loading" | "success" | "error";

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [state, setState] = useState<ResetState>("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [hasToken, setHasToken] = useState<boolean | null>(null);

    useEffect(() => {
        const hash = window.location.hash;
        const hasAccessToken = hash.includes("access_token=");
        setHasToken(hasAccessToken);

        if (!hasAccessToken) {
            setState("error");
            setErrorMessage("Este enlace de recuperación no es válido o ha expirado.");
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 8) {
            toast.error("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        setState("loading");

        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) throw error;

            setState("success");
            toast.success("Contraseña actualizada", {
                description: "Ahora puedes iniciar sesión con tu nueva contraseña.",
            });

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error: any) {
            setState("error");
            setErrorMessage(error.message || "No se pudo restablecer la contraseña.");
        }
    };

    if (hasToken === null) {
        return (
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="space-y-1 px-0 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </CardHeader>
            </Card>
        );
    }

    if (state === "error") {
        return (
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="space-y-1 px-0 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Enlace Inválido</CardTitle>
                    <CardDescription>{errorMessage}</CardDescription>
                </CardHeader>
                <CardFooter className="px-0 justify-center">
                    <Link to="/forgot-password">
                        <Button variant="link" className="text-primary">
                            Solicitar nuevo enlace
                        </Button>
                    </Link>
                </CardFooter>
                <CardContent className="px-0 text-center">
                    <Link to="/login">
                        <Button variant="link" className="text-primary">
                            Volver al inicio de sesión
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    if (state === "success") {
        return (
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="space-y-1 px-0 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Contraseña Restablecida</CardTitle>
                    <CardDescription>
                        Tu contraseña ha sido actualizada correctamente.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0 text-center">
                    <p className="text-sm text-muted-foreground">
                        Redirigiendo a inicio de sesión...
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-2xl font-bold">Nueva Contraseña</CardTitle>
                <CardDescription>
                    Ingresa tu nueva contraseña para continuar.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nueva Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={state === "loading"}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Repite la contraseña"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={state === "loading"}
                        />
                    </div>
                    <Button className="w-full" type="submit" disabled={state === "loading"}>
                        {state === "loading" ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <Key className="mr-2 h-4 w-4" />
                                Restablecer Contraseña
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="px-0">
                <p className="text-sm text-muted-foreground w-full text-center">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}