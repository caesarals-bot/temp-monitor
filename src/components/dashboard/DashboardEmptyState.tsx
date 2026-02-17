import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Info } from "lucide-react";
import { useNavigate } from "react-router";

export const DashboardEmptyState = () => {
    const navigate = useNavigate();

    return (
        <Card className="border-dashed border-2">
            <CardHeader className="text-center">
                <div className="mx-auto bg-blue-50 p-3 rounded-full w-fit mb-4">
                    <Info className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Aún no hay equipos registrados</CardTitle>
                <CardDescription>
                    Para comenzar a registrar temperaturas, primero necesitas agregar tus refrigeradores o congeladores.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
                <Button onClick={() => navigate('/dashboard/equipment')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar Primer Equipo
                </Button>
            </CardContent>
        </Card>
    );
};
