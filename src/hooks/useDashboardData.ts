import { useApp } from '@/context/AppContext';
import type { Equipment, TemperatureReading } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export interface EquipmentDashboardItem extends Equipment {
    lastReading?: TemperatureReading;
    status: 'normal' | 'warning' | 'alert' | 'no_data';
    lastUpdatedText: string;
}

export const useDashboardData = () => {
    const { equipment, getLastReading, currentUser } = useApp();

    const filteredEquipment = currentUser?.restaurant_id
        ? equipment.filter(eq => eq.restaurant_id === currentUser.restaurant_id)
        : equipment;

    const dashboardData: EquipmentDashboardItem[] = filteredEquipment.map((eq) => {
        const lastReading = getLastReading(eq.id);
        let status: EquipmentDashboardItem['status'] = 'no_data';
        let lastUpdatedText = 'Sin registros';

        if (lastReading) {
            // Lógica de estado simple
            if (lastReading.value < eq.min_temp || lastReading.value > eq.max_temp) {
                status = 'alert';
            } else if (
                lastReading.value <= eq.min_temp + 1 ||
                lastReading.value >= eq.max_temp - 1
            ) {
                status = 'warning'; // Cerca del límite (margen de 1 grado)
            } else {
                status = 'normal';
            }

            lastUpdatedText = formatDistanceToNow(new Date(lastReading.recorded_at), {
                addSuffix: true,
                locale: es,
            });
        }

        return {
            ...eq,
            lastReading,
            status,
            lastUpdatedText,
        };
    });

    return { dashboardData };
};
