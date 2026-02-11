import { useTemperatureEntry } from '@/hooks/useTemperatureEntry';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
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

interface TemperatureEntryFormProps {
    onSuccess?: () => void;
}

export const TemperatureEntryForm = ({ onSuccess }: TemperatureEntryFormProps) => {
    const { form, onSubmit, isSubmitting } = useTemperatureEntry(onSuccess);
    const { equipment, restaurants, users } = useApp();

    // Watch for selections to filter downstream
    const selectedRestaurantId = form.watch('restaurant_id');
    const selectedUserId = form.watch('user_id');

    // Filtered lists
    const filteredUsers = users.filter(u => u.restaurant_id === selectedRestaurantId);

    // Solo mostrar equipos del restaurante seleccionado
    // Y si se quisiera, filtrar por permisos del usuario, pero por ahora mostramos todos los del restaurante
    const filteredEquipment = equipment.filter(eq => eq.restaurant_id === selectedRestaurantId);

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">

                {/* Paso 1: Seleccionar Restaurante */}
                <FormField
                    control={form.control as any}
                    name="restaurant_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Restaurante</FormLabel>
                            <Select
                                onValueChange={(val) => {
                                    field.onChange(val);
                                    form.setValue('user_id', ''); // Reset dependent fields
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

                {/* Paso 2: Seleccionar Usuario (Staff) */}
                <FormField
                    control={form.control as any}
                    name="user_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Realizado por</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={!selectedRestaurantId} // Disable if no restaurant selected
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={selectedRestaurantId ? "Selecciona tu usuario" : "Primero selecciona restaurante"} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filteredUsers.map((u) => (
                                        <SelectItem key={u.id} value={u.id}>
                                            {u.name} ({u.role})
                                        </SelectItem>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <SelectItem value="none" disabled>No hay usuarios asignados</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Verifica que sea tu usuario para validar la toma.
                            </FormDescription>
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
                                disabled={!selectedRestaurantId || !selectedUserId}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={selectedUserId ? "Selecciona un equipo" : "Primero selecciona usuario"} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {filteredEquipment.map((eq) => (
                                        <SelectItem key={eq.id} value={eq.id}>
                                            <span className="font-medium">{eq.name}</span>
                                            <span className="ml-2 text-xs text-muted-foreground">({eq.code})</span>
                                        </SelectItem>
                                    ))}
                                    {filteredEquipment.length === 0 && (
                                        <SelectItem value="none" disabled>No hay equipos en este local</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Campo de Temperatura */}
                <FormField
                    control={form.control as any}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Temperatura (°C)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="Ej. 4.5" {...field} />
                            </FormControl>
                            <FormDescription>
                                Ingresa la lectura actual del termómetro.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Campo de Notas */}
                <FormField
                    control={form.control as any}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notas (Opcional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Ej. Puerta abierta durante carga..."
                                    className="resize-none"
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
