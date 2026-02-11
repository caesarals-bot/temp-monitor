import { useState } from 'react';
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { TemperatureEntryForm } from "@/components/dashboard/TemperatureEntryForm";
import { TemperatureChart } from "@/components/dashboard/TemperatureChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";

export const DashboardPage = () => {
    const { dashboardData } = useDashboardData();
    const { restaurants, currentUser } = useApp();
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('all');

    const filteredData = dashboardData.filter(item => {
        if (currentUser?.restaurant_id) return true; // useDashboardData ya filtra por usuario si tiene restricción
        if (selectedRestaurantId === 'all') return true;
        return item.restaurant_id === selectedRestaurantId;
    });

    const activeAlerts = filteredData.filter(i => i.status === 'alert').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Resumen de Estado</h1>
                    <p className="text-gray-500">
                        {activeAlerts > 0
                            ? `⚠️ Tienes ${activeAlerts} equipos con alertas de temperatura.`
                            : "Todos los equipos funcionando correctamente."}
                    </p>
                </div>

                {!currentUser?.restaurant_id && (
                    <Select value={selectedRestaurantId} onValueChange={setSelectedRestaurantId}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filtrar por Restaurante" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las Sucursales</SelectItem>
                            {restaurants.map(r => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <DashboardGrid data={filteredData} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Registrar Nueva Lectura</CardTitle>
                        <CardDescription>
                            Ingresa los datos del termómetro manual.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TemperatureEntryForm
                            onSuccess={() => { }}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tendencias</CardTitle>
                        <CardDescription>Historial de temperaturas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TemperatureChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
