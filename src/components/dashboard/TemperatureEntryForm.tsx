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

import { useEffect } from 'react';

interface TemperatureEntryFormProps {
    onSuccess?: () => void;
    defaultRestaurantId?: string;
}

export const TemperatureEntryForm = ({ onSuccess, defaultRestaurantId }: TemperatureEntryFormProps) => {
    const { form, onSubmit, isSubmitting } = useTemperatureEntry(onSuccess);
    const { equipment, restaurants, users, currentUser, currentRestaurant } = useApp();

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

        // 2. User
        if (currentUser?.id) {
            form.setValue('user_id', currentUser.id);
        }
    }, [currentRestaurant, currentUser, defaultRestaurantId, form]);

    // Filter lists
    const filteredUsers = users.filter(u => u.restaurant_id === selectedRestaurantId);

    // Si no hay usuarios asignados (ej. owner nuevo), permitirse a sí mismo si es su restaurante
    // o mostrar mensaje. Pero para evitar bloqueo, si la lista está vacía, podríamos mostrar al currentUser
    const displayUsers = filteredUsers.length > 0 ? filteredUsers : (currentUser && currentUser.restaurant_id === selectedRestaurantId ? [currentUser] : []);

    const filteredEquipment = equipment.filter(eq => eq.restaurant_id === selectedRestaurantId);

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">

                {/* Paso 1: Seleccionar Restaurante (Solo si no está predefinido por contexto) */}
                {/* Si ya tenemos currentRestaurant, mostramos un campo readonly o lo ocultamos y solo mostramos info */}
                {(!currentRestaurant && !defaultRestaurantId) && (
                    <FormField
                        control={form.control as any}
                        name="restaurant_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Restaurante</FormLabel>
                                <Select
                                    onValueChange={(val) => {
                                        field.onChange(val);
                                        form.setValue('equipment_id', '');
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona la sucursal" />
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

                {/* Paso 2: Usuario (Auto-seleccionado, pero editable si hay permisos) */}
                {/* Si solo hay un usuario (el actual), lo ocultamos o mostramos como texto estático */}
                <FormField
                    control={form.control as any}
                    name="user_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Realizado por</FormLabel>
                            {displayUsers.length <= 1 && currentUser ? (
                                <div className="p-2 bg-gray-50 rounded border text-sm text-gray-700">
                                    {currentUser.name}
                                </div>
                            ) : (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={!selectedRestaurantId}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona usuario" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {displayUsers.map((u) => (
                                            <SelectItem key={u.id} value={u.id}>
                                                {u.name} ({u.role})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <FormMessage />
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
