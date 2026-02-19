import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export const ProfilePage = () => {
    const { currentUser } = useApp();
    const [name, setName] = useState(currentUser?.name || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: name })
                .eq('id', currentUser.id);

            if (error) throw error;

            alert("Perfil actualizado correctamente. Por favor recarga la página para ver los cambios.");
            // In a real app we'd update context state directly here.

        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error al actualizar perfil");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
                <p className="text-gray-500">Administra tu información personal.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" value={currentUser?.email} disabled className="bg-gray-50" />
                        <p className="text-xs text-gray-500">El correo no se puede cambiar.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
