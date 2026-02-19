import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
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
import { StaffForm } from '@/components/admin/StaffForm';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export const StaffPage = () => {
    const { staff, restaurants, deleteStaff, currentUser } = useApp();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('all');

    // Filter staff based on selection or user's assigned restaurant
    const filteredStaff = staff.filter(s => {
        // If specific restaurant selected, filter by it
        if (selectedRestaurantId !== 'all') {
            return s.restaurant_id === selectedRestaurantId;
        }
        // Otherwise show all valid staff (belonging to my visible restaurants)
        return restaurants.some(r => r.id === s.restaurant_id);
    });

    // Helper para obtener nombre del restaurante
    const getRestaurantName = (id: string) => {
        return restaurants.find(r => r.id === id)?.name || 'Desconocido';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestión de Personal</h1>
                    <p className="text-sm sm:text-base text-gray-500">Administra los colaboradores que toman lecturas.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    {/* Solo mostrar filtro si el usuario NO tiene sede asignada (es admin global) */}
                    {!currentUser?.restaurant_id && (
                        <Select value={selectedRestaurantId} onValueChange={setSelectedRestaurantId}>
                            <SelectTrigger className="w-full sm:w-[200px]">
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

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Colaborador
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Registrar Nuevo Colaborador</DialogTitle>
                            </DialogHeader>
                            <StaffForm onSuccess={() => setIsDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="border rounded-lg bg-white shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Sede</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStaff.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell>{getRestaurantName(member.restaurant_id)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                            if (confirm(`¿Estás seguro de eliminar a ${member.name}?`)) {
                                                deleteStaff(member.id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredStaff.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    No hay colaboradores registrados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
