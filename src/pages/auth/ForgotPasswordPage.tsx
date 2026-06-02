import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function ForgotPasswordPage() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            await forgotPassword(email);
            setEmailSent(true);
            toast.success("Correo enviado", {
                description: "Revisa tu bandeja de entrada para restablecer tu contraseña.",
            });
        } catch (error: any) {
            toast.error(error.message || "Error al enviar correo de recuperación");
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="space-y-1 px-0 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Correo Enviado</CardTitle>
                    <CardDescription>
                        Hemos enviado un enlace de recuperación a <strong>{email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardFooter className="px-0 justify-center">
                    <p className="text-sm text-muted-foreground">
                        ¿No recibiste el correo?{" "}
                        <button
                            type="button"
                            onClick={() => setEmailSent(false)}
                            className="font-medium text-primary hover:underline"
                        >
                            Intentar de nuevo
                        </button>
                    </p>
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

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-2xl font-bold">¿Olvidaste tu contraseña?</CardTitle>
                <CardDescription>
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            "Enviar enlace de recuperación"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="px-0">
                <p className="text-sm text-muted-foreground w-full text-center">
                    ¿Recordaste tu contraseña?{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}