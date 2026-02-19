import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { temperatureEntrySchema } from '@/lib/schemas';
import type { TemperatureEntryFormValues } from '@/lib/schemas';
import { useApp } from '@/context/AppContext';

export const useTemperatureEntry = (onSuccess?: () => void) => {
    const { addReading } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<TemperatureEntryFormValues>({
        resolver: zodResolver(temperatureEntrySchema) as any,
        defaultValues: {
            restaurant_id: '',
            member_id: '',
            equipment_id: '',
            notes: '',
            value: undefined,
        },
    });

    const onSubmit = async (data: TemperatureEntryFormValues) => {
        setIsSubmitting(true);
        try {
            await addReading({
                equipment_id: data.equipment_id,
                value: data.value,
                notes: data.notes,
                member_id: data.member_id, // Pass to AppContext
            } as any);
            form.reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Error al registrar temperatura:", error);
            // Aquí podríamos agregar un toast de error
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit as any),
        isSubmitting,
    };
};
