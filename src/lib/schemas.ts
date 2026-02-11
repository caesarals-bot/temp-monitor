import { z } from 'zod';

export const temperatureEntrySchema = z.object({
    restaurant_id: z.string().min(1, "Selecciona un restaurante."),
    user_id: z.string().min(1, "Selecciona el usuario que registra."),
    equipment_id: z.string().min(1, "Por favor selecciona un equipo."),
    value: z.coerce.number()
        .min(-100, "La temperatura debe ser mayor a -100°C")
        .max(300, "La temperatura debe ser menor a 300°C"),
    notes: z.string().optional(),
});

export const equipmentSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    code: z.string().min(2, "El código debe tener al menos 2 caracteres."),
    restaurant_id: z.string().min(1, "Selecciona un restaurante."),
    min_temp: z.coerce.number(),
    max_temp: z.coerce.number(),
});

export const restaurantSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    address: z.string().optional(),
});

export const userSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
    role: z.enum(['admin', 'manager', 'staff']),
    restaurant_id: z.string().optional(), // Opcional porque un admin global podría no tener restaurante
});

export type TemperatureEntryFormValues = z.infer<typeof temperatureEntrySchema>;
export type EquipmentFormValues = z.infer<typeof equipmentSchema>;
export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
export type UserFormValues = z.infer<typeof userSchema>;
