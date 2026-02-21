import { useEffect, useState } from 'react';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Settings2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Organization } from '@/types';

export const OrganizationsManager = () => {
    const { organizations, isLoadingOrgs, fetchOrganizations, updateOrganizationStatus, updateMaxRestaurants } = useSuperAdmin();
    const [searchTerm, setSearchTerm] = useState("");
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [newStatus, setNewStatus] = useState<'active' | 'paused' | 'suspended'>('active');
    const [newMaxRest, setNewMaxRest] = useState<number>(1);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const filteredOrgs = organizations.filter(o =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openEditModal = (org: Organization) => {
        setEditingOrg(org);
        setNewStatus(org.status || 'active');
        setNewMaxRest(org.max_restaurants || 1);
    };

    const handleSave = async () => {
        if (!editingOrg) return;
        setIsSaving(true);
        try {
            if (editingOrg.status !== newStatus) {
                await updateOrganizationStatus(editingOrg.id, newStatus);
            }
            if (editingOrg.max_restaurants !== newMaxRest) {
                await updateMaxRestaurants(editingOrg.id, newMaxRest);
            }
            toast.success("Organización actualizada correctamente");
            setEditingOrg(null);
        } catch (error: any) {
            toast.error(error.message || "Error al actualizar organización");
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-800';
            case 'paused': return 'bg-amber-100 text-amber-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Organizaciones</h1>
                    <p className="text-slate-500 mt-1">Administra accesos y capacidades de todos los clientes.</p>
                </div>
                <Input
                    placeholder="Buscar por nombre..."
                    className="max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Cliente / Nombre</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Tipo de Plan</th>
                                <th className="px-6 py-4 text-center">Límite Sedes</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoadingOrgs ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        Cargando organizaciones...
                                    </td>
                                </tr>
                            ) : filteredOrgs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No se encontraron organizaciones.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrgs.map(org => (
                                    <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                            <div className="p-2 rounded-md bg-purple-50">
                                                <Building2 className="h-4 w-4 text-purple-600" />
                                            </div>
                                            {org.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className={`font-normal ${getStatusColor(org.status)}`}>
                                                {org.status === 'paused' ? 'Pausado' : org.status === 'suspended' ? 'Suspendido' : 'Activo'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                                            {org.plan_type || 'FREE'}
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">
                                            {org.max_restaurants || 1}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => openEditModal(org)}
                                            >
                                                <Settings2 className="h-4 w-4 mr-2" />
                                                Gestionar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Edición */}
            <Dialog open={!!editingOrg} onOpenChange={(open) => !open && setEditingOrg(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gestionar Cliente: {editingOrg?.name}</DialogTitle>
                        <DialogDescription>
                            Modifica las capacidades operativas y el estado de servicio de esta organización.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estado del Servicio</label>
                            <Select value={newStatus} onValueChange={(val: any) => setNewStatus(val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">🟢 Activo (Operable)</SelectItem>
                                    <SelectItem value="paused">🟡 Pausado (Solo Lectura - Falta pago)</SelectItem>
                                    <SelectItem value="suspended">🔴 Suspendido (Bloqueado temporalmente)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500">Un estado Pausado/Suspendido impedirá el acceso a los usuarios de este cliente.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Límite Máximo de Sedes (Restaurantes)</label>
                            <Input
                                type="number"
                                min="1"
                                value={newMaxRest}
                                onChange={(e) => setNewMaxRest(parseInt(e.target.value) || 1)}
                            />
                            <p className="text-xs text-slate-500">Aumenta este límite si el cliente actualiza su plan de subscripción.</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingOrg(null)}>Cancelar</Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
