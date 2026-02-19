import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { restaurantSchema } from '@/lib/schemas';
import type { RestaurantFormValues } from '@/lib/schemas';
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
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RestaurantFormProps {
    onSuccess: () => void;
}

export const RestaurantForm = ({ onSuccess }: RestaurantFormProps) => {
    const { addRestaurant } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<RestaurantFormValues>({
        resolver: zodResolver(restaurantSchema) as any,
        defaultValues: {
            name: '',
            address: '',
        },
    });

    const onSubmit = async (data: RestaurantFormValues) => {
        setIsSubmitting(true);
        try {
            await addRestaurant(data);
            form.reset();
            onSuccess();
        } catch (error) {
            console.error("Error creating restaurant:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
                <FormField
                    control={form.control as any}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre de la Sede</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. Sucursal Centro" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control as any}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Dirección (Opcional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. Calle 123" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Crear Sede
                </Button>
            </form>
        </Form>
    );
};
