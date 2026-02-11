import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { EquipmentForm } from '@/components/admin/EquipmentForm';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export const EquipmentPage = () => {
    const { equipment, restaurants, deleteEquipment, currentUser } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('all');

    // Filter equipment based on selection or user's assigned restaurant
    const filteredEquipment = equipment.filter(eq => {
        // If user is restricted to a restaurant, always filter by it
        if (currentUser?.restaurant_id) {
            return eq.restaurant_id === currentUser.restaurant_id;
        }
        // Otherwise use the dropdown filter
        if (selectedRestaurantId === 'all') return true;
        return eq.restaurant_id === selectedRestaurantId;
    });

    // Helper para obtener nombre del restaurante
    const getRestaurantName = (id: string) => {
        return restaurants.find(r => r.id === id)?.name || 'Desconocido';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Equipos</h1>
                    <p className="text-gray-500">Administra los refrigeradores y equipos de todos los restaurantes.</p>
                </div>

                <div className="flex gap-2">
                    {/* Solo mostrar filtro si el usuario NO tiene restaurante asignado (es admin global) */}
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

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Equipo
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
                            </DialogHeader>
                            <EquipmentForm onSuccess={() => setIsDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="border rounded-lg bg-white shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Restaurante</TableHead>
                            <TableHead>Rango (°C)</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEquipment.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono text-xs font-medium">{item.code}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{getRestaurantName(item.restaurant_id)}</TableCell>
                                <TableCell>{item.min_temp}° / {item.max_temp}°</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                            if (confirm('¿Estás seguro de eliminar este equipo?')) {
                                                deleteEquipment(item.id);
                                            }
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
