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

import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";

export const DashboardPage = () => {
    const { dashboardData } = useDashboardData();
    const { restaurants, currentUser, equipment } = useApp();
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('all');

    const filteredData = dashboardData.filter(item => {
        if (currentUser?.restaurant_id) return true;
        if (selectedRestaurantId === 'all') return true;
        return item.restaurant_id === selectedRestaurantId;
    });

    const activeAlerts = filteredData.filter(i => i.status === 'alert').length;

    // Filter equipment to know if we should show empty state
    const filteredEquipment = equipment.filter(e => {
        // Si hay un filtro de restaurante específico activos, usarlo
        if (selectedRestaurantId !== 'all') {
            return e.restaurant_id === selectedRestaurantId;
        }
        // Si es 'all', mostrar todos los equipos de mis restaurantes disponibles
        // (Ya que equipment viene filtrado por RLS o fetch, pero por seguridad UX filtramos por userRestaurants)
        return restaurants.some(r => r.id === e.restaurant_id);
    });

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
                            <SelectValue placeholder="Filtrar por Sede" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las Sedes</SelectItem>
                            {restaurants.map(r => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {filteredEquipment.length === 0 ? (
                <DashboardEmptyState />
            ) : (
                <>
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
                                    defaultRestaurantId={selectedRestaurantId !== 'all' ? selectedRestaurantId : undefined}
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
                </>
            )}
        </div>
    );
};
