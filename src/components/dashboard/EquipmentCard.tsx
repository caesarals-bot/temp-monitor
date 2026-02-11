import type { EquipmentDashboardItem } from '@/hooks/useDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EquipmentCardProps {
    equipment: EquipmentDashboardItem;
}

export const EquipmentCard = ({ equipment }: EquipmentCardProps) => {
    const { name, code, lastReading, status, lastUpdatedText, min_temp, max_temp } = equipment;

    const statusConfig = {
        normal: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Normal' },
        warning: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle, label: 'Precaución' },
        alert: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle, label: 'Alerta' },
        no_data: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock, label: 'Sin Datos' },
    };

    const currentStatus = statusConfig[status];
    const StatusIcon = currentStatus.icon;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-medium">
                        {name}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                        {code}
                    </span>
                </div>
                <Badge variant="outline" className={cn("font-medium", currentStatus.color)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {currentStatus.label}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between mt-2">
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold">
                            {lastReading ? `${lastReading.value}°C` : '--'}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                            Rango: {min_temp}° a {max_temp}°
                        </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {lastUpdatedText}
                    </div>
                </div>

                {/* Barra visual de rango (decorativa) */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden flex">
                    {/* Solo mostramos la barra si hay datos */}
                    {lastReading && (
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-500",
                                status === 'alert' ? "bg-red-500" :
                                    status === 'warning' ? "bg-yellow-500" : "bg-green-500"
                            )}
                            style={{ width: '100%' }} // Simple full bar color for MVP
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
