import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { equipmentSchema } from '@/lib/schemas';
import type { EquipmentFormValues } from '@/lib/schemas';
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

interface EquipmentFormProps {
    onSuccess: () => void;
}

export const EquipmentForm = ({ onSuccess }: EquipmentFormProps) => {
    const { addEquipment, restaurants } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<EquipmentFormValues>({
        resolver: zodResolver(equipmentSchema) as any,
        defaultValues: {
            name: '',
            code: '',
            restaurant_id: '',
            min_temp: undefined,
            max_temp: undefined,
        },
    });

    const onSubmit = async (data: EquipmentFormValues) => {
        setIsSubmitting(true);
        try {
            await addEquipment(data);
            form.reset();
            onSuccess();
        } catch (error) {
            console.error("Error creating equipment:", error);
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
                            <FormLabel>Nombre del Equipo</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. Refrigerador Principal" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control as any}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej. REF-01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="restaurant_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Restaurante</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar" />
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control as any}
                        name="min_temp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mín Temp (°C)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Ej. 1"
                                        {...field}
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="max_temp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Máx Temp (°C)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Ej. 5"
                                        {...field}
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Crear Equipo
                </Button>
            </form>
        </Form>
    );
};
