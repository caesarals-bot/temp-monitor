import { useEffect, useState } from 'react';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, KeyRound, UserCircle, Search, MailWarning } from 'lucide-react';
import { toast } from 'sonner';

export const UsersManager = () => {
    const { globalUsers, isLoadingUsers, fetchGlobalUsers, forcePasswordReset } = useSuperAdmin();
    const [searchTerm, setSearchTerm] = useState("");
    const [resettingId, setResettingId] = useState<string | null>(null);

    useEffect(() => {
        fetchGlobalUsers();
    }, []);

    const filteredUsers = globalUsers.filter(u =>
        (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleResetPassword = async (email: string, id: string) => {
        if (!email) {
            toast.error("El usuario no tiene un email válido.");
            return;
        }

        if (!confirm(`¿Estás seguro de enviar un correo de recuperación a ${email}?`)) return;

        setResettingId(id);
        try {
            await forcePasswordReset(email);
            toast.success(`Correo de recuperación enviado a ${email}`);
        } catch (error: any) {
            toast.error(error.message || "Error al enviar correo de recuperación");
        } finally {
            setResettingId(null);
        }
    };

    const getRoleBadge = (role: string, isSuperAdmin: boolean) => {
        if (isSuperAdmin) return <Badge className="bg-purple-500 hover:bg-purple-600">Super Admin</Badge>;
        switch (role) {
            case 'owner': return <Badge variant="default" className="bg-blue-600">Propietario</Badge>;
            case 'admin': return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">Admin</Badge>;
            case 'manager': return <Badge variant="outline" className="border-amber-500 text-amber-700">Manager</Badge>;
            case 'staff': return <Badge variant="outline" className="border-slate-300 text-slate-600">Staff</Badge>;
            default: return <Badge variant="outline">Desconocido</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios Globales</h1>
                    <p className="text-slate-500 mt-1">Administra el acceso y la seguridad de todas las cuentas del sistema.</p>
                </div>
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar por email o nombre..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Rol en Plataforma</th>
                                <th className="px-6 py-4">Organización Asignada</th>
                                <th className="px-6 py-4 text-right">Acciones de Seguridad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoadingUsers ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        Cargando base de datos de usuarios...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        Ningún usuario coincide con la búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                <UserCircle className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{user.full_name || 'Sin Nombre'}</p>
                                                <p className="text-xs text-slate-500">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.role, user.is_platform_admin)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.is_platform_admin ? (
                                                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Acceso Global</span>
                                            ) : user.organizations ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-800">{user.organizations.name}</span>
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider ${user.organizations.status === 'active' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                        {user.organizations.status}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Sin asignar</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                                                onClick={() => handleResetPassword(user.email, user.id)}
                                                disabled={resettingId === user.id}
                                            >
                                                {resettingId === user.id ? (
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <KeyRound className="h-4 w-4 mr-2" />
                                                )}
                                                Resetear Clave
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
                <MailWarning className="h-5 w-5 flex-shrink-0 text-amber-600" />
                <p>
                    <strong>Nota:</strong> Al presionar "Resetear Clave", Supabase enviará automáticamente un correo a la dirección del usuario con un enlace seguro (Edge Function predeterminada) para restablecer la contraseña. Esto no invalida su sesión actual automáticamente hasta que la cambie.
                </p>
            </div>
        </div>
    );
};
