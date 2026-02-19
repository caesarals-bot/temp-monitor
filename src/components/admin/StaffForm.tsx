import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Schema local para este form
const staffSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    role: z.string().min(2, "El cargo es requerido"),
    restaurant_id: z.string().min(1, "La sede es requerida"),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffFormProps {
    onSuccess: () => void;
}

export const StaffForm = ({ onSuccess }: StaffFormProps) => {
    const { addStaff, restaurants, currentUser, currentRestaurant } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Determinar sede por defecto: Si el currentRestaurant está seleccionado, usar ese.
    // Si no, si el usuario tiene una sede asignada, usar esa.
    const defaultRestaurantId = currentRestaurant?.id || currentUser?.restaurant_id || '';

    const form = useForm<StaffFormValues>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            name: '',
            role: '',
            restaurant_id: defaultRestaurantId,
        },
    });

    const onSubmit = async (data: StaffFormValues) => {
        setIsSubmitting(true);
        try {
            await addStaff(data);
            form.reset();
            onSuccess();
        } catch (error) {
            console.error("Error creating staff:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Colaborador</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. Pedro Gómez" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cargo / Rol</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. Cocinero, Ayudante, Chef..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="restaurant_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sede Asignada</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!currentUser?.restaurant_id}>
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

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Registrar Colaborador
                </Button>
            </form>
        </Form>
    );
};
