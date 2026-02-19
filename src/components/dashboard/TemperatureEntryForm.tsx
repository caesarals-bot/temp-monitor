import { useTemperatureEntry } from '@/hooks/useTemperatureEntry';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router';

import { useEffect } from 'react';

interface TemperatureEntryFormProps {
    onSuccess?: () => void;
    defaultRestaurantId?: string;
}

export const TemperatureEntryForm = ({ onSuccess, defaultRestaurantId }: TemperatureEntryFormProps) => {
    const { form, onSubmit, isSubmitting } = useTemperatureEntry(onSuccess);
    const { equipment, restaurants, users, staff, currentUser, currentRestaurant } = useApp();

    // Watch for selections
    const selectedRestaurantId = form.watch('restaurant_id');

    // Auto-select restaurant and user
    useEffect(() => {
        // 1. Restaurant
        if (currentRestaurant?.id) {
            form.setValue('restaurant_id', currentRestaurant.id);
        } else if (defaultRestaurantId && defaultRestaurantId !== 'all') {
            form.setValue('restaurant_id', defaultRestaurantId);
        }

        // 2. Member (Default to current user if no selection)
        // Only set if not already set (to avoid overwriting user selection)
        if (currentUser?.id && !form.getValues('member_id')) {
            form.setValue('member_id', currentUser.id);
        }
    }, [currentRestaurant, currentUser, defaultRestaurantId, form]);

    // Filter lists
    const filteredUsers = users.filter(u => u.restaurant_id === selectedRestaurantId);
    const filteredStaff = staff.filter(s => s.restaurant_id === selectedRestaurantId);

    // Combine for display
    const potentialMembers = [
        ...filteredUsers.map(u => ({ id: u.id, name: u.name, role: u.role, type: 'Usuario' })),
        ...filteredStaff.map(s => ({ id: s.id, name: s.name, role: s.role, type: 'Staff' }))
    ];

    // Ensure current user is in list if not filtered (e.g. global admin acting as staff)
    if (currentUser && !potentialMembers.find(m => m.id === currentUser.id)) {
        potentialMembers.push({ id: currentUser.id, name: currentUser.name, role: currentUser.role, type: 'Usuario' });
    }

    const displayMembers = potentialMembers;

    const filteredEquipment = equipment.filter(eq => eq.restaurant_id === selectedRestaurantId);

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">

                {/* Paso 1: Seleccionar Sede (Solo si no está predefinido por contexto) */}
                {/* Si ya tenemos currentRestaurant, mostramos un campo readonly o lo ocultamos y solo mostramos info */}
                {(!currentRestaurant && !defaultRestaurantId) && (
                    <FormField
                        control={form.control as any}
                        name="restaurant_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sede</FormLabel>
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        form.setValue('equipment_id', '');
                                        form.setValue('member_id', ''); // Reset member on sede change? Maybe not if global user.
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona la sede" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {restaurants.map((r) => (
                                            <SelectItem key={r.id} value={r.id}>
                                                {r.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {/* Paso 2: Usuario / Staff */}
                <FormField
                    control={form.control as any}
                    name="member_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Realizado por</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!selectedRestaurantId}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona quién registra" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {displayMembers.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>
                                            {m.name} ({m.role})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            {/* Mostrar invitación a agregar personal si la lista es corta (solo el usuario actual) */}
                            {selectedRestaurantId && displayMembers.length <= 1 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    ¿No encuentras a quien buscas?{' '}
                                    <Link to="/dashboard/staff" className="text-blue-600 hover:underline">
                                        Registrar Personal
                                    </Link>
                                </p>
                            )}
                        </FormItem>
                    )}
                />

                {/* Paso 3: Seleccionar Equipo */}
                <FormField
                    control={form.control as any}
                    name="equipment_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Equipo</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!selectedRestaurantId}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un equipo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filteredEquipment.map((eq) => (
                                        <SelectItem key={eq.id} value={eq.id}>
                                            <span className="font-medium">{eq.name}</span>
                                            {eq.code && <span className="ml-2 text-xs text-muted-foreground">({eq.code})</span>}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            {/* Mostrar invitación a agregar equipo si no hay equipos para la sede seleccionada */}
                            {selectedRestaurantId && filteredEquipment.length === 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    No hay equipos registrados en esta sede.{' '}
                                    <Link to="/dashboard/equipment" className="text-blue-600 hover:underline">
                                        Agregar Equipo
                                    </Link>
                                </p>
                            )}
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control as any}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Temperatura (°C)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" placeholder="Ej. 4.5" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control as any}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notas (Opcional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Observaciones..."
                                    className="resize-none h-20"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        'Registrar Lectura'
                    )}
                </Button>
            </form>
        </Form>
    );
};
