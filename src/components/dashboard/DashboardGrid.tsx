import type { EquipmentDashboardItem } from '@/hooks/useDashboardData';
import { EquipmentCard } from '@/components/dashboard/EquipmentCard';

interface DashboardGridProps {
    data: EquipmentDashboardItem[];
}

export const DashboardGrid = ({ data }: DashboardGridProps) => {
    if (data.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No hay equipos registrados que coincidan con el filtro.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
            ))}
        </div>
    );
};
