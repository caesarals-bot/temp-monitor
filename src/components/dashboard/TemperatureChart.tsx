import { useTemperatureHistory } from '@/hooks/useTemperatureHistory';
import type { TimeRange } from '@/hooks/useTemperatureHistory';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TemperatureChartProps {
    equipmentId?: string;
}

export const TemperatureChart = ({ equipmentId }: TemperatureChartProps) => {
    // Si no hay ID, no renderizamos nada (o un placeholder) por ahora.
    // El hook useTemperatureHistory debería manejar undefined o lo validamos aquí.
    if (!equipmentId) {
        return (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                Selecciona un equipo para ver su historial.
            </div>
        );
    }

    const { historyData, timeRange, setTimeRange, selectedEquipment } = useTemperatureHistory(equipmentId);

    if (!selectedEquipment) return null;

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>Historial de Temperatura - {selectedEquipment.name}</CardTitle>
                    <CardDescription>
                        Monitoreo de tendencias y excursiones térmicas.
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={(val: TimeRange) => setTimeRange(val)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Rango" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="24h">Últimas 24h</SelectItem>
                        <SelectItem value="7d">Últimos 7 días</SelectItem>
                        <SelectItem value="30d">Últimos 30 días</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                    {historyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    axisLine={false}
                                    tickLine={false}
                                    unit="°C"
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                {/* Líneas de Límites */}
                                <ReferenceLine y={selectedEquipment.max_temp} label="Max" stroke="#EF4444" strokeDasharray="3 3" />
                                <ReferenceLine y={selectedEquipment.min_temp} label="Min" stroke="#3B82F6" strokeDasharray="3 3" />

                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#10B981', strokeWidth: 2 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            No hay datos para este período.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
