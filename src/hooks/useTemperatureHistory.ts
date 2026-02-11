import { useApp } from '@/context/AppContext';
import { useState, useMemo } from 'react';
import { subDays, subWeeks, subMonths, isAfter } from 'date-fns';

export type TimeRange = '24h' | '7d' | '30d';

export const useTemperatureHistory = (equipmentId: string) => {
    const { readings, equipment } = useApp();
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');

    const selectedEquipment = equipment.find(e => e.id === equipmentId);

    const historyData = useMemo(() => {
        if (!selectedEquipment) return [];

        const now = new Date();
        let startDate: Date;

        switch (timeRange) {
            case '24h': startDate = subDays(now, 1); break;
            case '7d': startDate = subWeeks(now, 1); break;
            case '30d': startDate = subMonths(now, 1); break;
        }

        // Filtrar lecturas por equipo y rango de fecha
        const filteredReadings = readings
            .filter(r => r.equipment_id === equipmentId && isAfter(new Date(r.recorded_at), startDate))
            .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());

        // Formatear para Recharts
        return filteredReadings.map(r => ({
            date: new Date(r.recorded_at).toLocaleString('es-ES', {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }),
            value: r.value,
            min: selectedEquipment.min_temp,
            max: selectedEquipment.max_temp,
            originalDate: r.recorded_at // Para tooltips u ordenamiento si fuera necesario
        }));

    }, [readings, equipmentId, timeRange, selectedEquipment]);

    return {
        historyData,
        timeRange,
        setTimeRange,
        selectedEquipment
    };
};
