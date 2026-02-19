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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { RestaurantForm } from '@/components/admin/RestaurantForm';
import { UserForm } from '@/components/admin/UserForm';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export const SettingsPage = () => {
    const { restaurants, users } = useApp();
    const [isRestDialogOpen, setIsRestDialogOpen] = useState(false);
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [selectedUserRestaurantId, setSelectedUserRestaurantId] = useState<string>('all');

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRestaurantName = (id?: string) => {
        if (!id) return <span className="text-gray-400 italic">Global / Sin asignar</span>;
        const r = restaurants.find(r => r.id === id);
        return r ? r.name : 'Desconocido';
    };

    const filteredUsers = users.filter(user => {
        if (selectedUserRestaurantId === 'all') return true;
        return user.restaurant_id === selectedUserRestaurantId;
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
                <p className="text-gray-500">Administra las sucursales, usuarios y permisos del sistema.</p>
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="users">Usuarios y Personal</TabsTrigger>
                    <TabsTrigger value="restaurants">Sedes</TabsTrigger>
                </TabsList>

                <TabsContent value="restaurants" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold">Lista de Sedes</h2>
                            <p className="text-sm text-gray-500">Gestiona las ubicaciones físicas.</p>
                        </div>
                        <Dialog open={isRestDialogOpen} onOpenChange={setIsRestDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nueva Sede
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Agregar Nueva Sede</DialogTitle>
                                </DialogHeader>
                                <RestaurantForm onSuccess={() => setIsRestDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Dirección</TableHead>
                                    <TableHead className="text-right">ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {restaurants.map((rest) => (
                                    <TableRow key={rest.id}>
                                        <TableCell className="font-medium">{rest.name}</TableCell>
                                        <TableCell>{rest.address || '-'}</TableCell>
                                        <TableCell className="text-right font-mono text-xs text-muted-foreground">{rest.id}</TableCell>
                                    </TableRow>
                                ))}
                                {restaurants.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                            No hay restaurantes registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-lg font-semibold">Personal Registrado</h2>
                                <p className="text-sm text-gray-500">Administra quién tiene acceso.</p>
                            </div>
                            <Select value={selectedUserRestaurantId} onValueChange={setSelectedUserRestaurantId}>
                                <SelectTrigger className="w-[200px] h-9">
                                    <SelectValue placeholder="Filtrar por Sede" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los Usuarios</SelectItem>
                                    {restaurants.map(r => (
                                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Usuario
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
                                </DialogHeader>
                                <UserForm onSuccess={() => setIsUserDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Sede Asignada</TableHead>
                                    <TableHead className="text-right">ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>{getRestaurantName(user.restaurant_id)}</TableCell>
                                        <TableCell className="text-right font-mono text-xs text-muted-foreground">{user.id}</TableCell>
                                    </TableRow>
                                ))}
                                {users.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                            No hay usuarios registrados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
