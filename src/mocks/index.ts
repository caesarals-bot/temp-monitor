import type { Equipment, Restaurant, TemperatureReading, User } from '@/types';
import { subMinutes, subHours } from 'date-fns';

export const mockUsers: User[] = [
    { id: 'u1', name: 'Chef Mario', email: 'mario@example.com', role: 'manager', restaurant_id: 'r1' },
    { id: 'u2', name: 'Ayudante Juan', email: 'juan@example.com', role: 'staff', restaurant_id: 'r1' },
    { id: 'u3', name: 'Gerente Ana', email: 'ana@example.com', role: 'manager', restaurant_id: 'r2' },
    { id: 'u4', name: 'Supervisor Carlos', email: 'carlos@example.com', role: 'admin' }, // Admin global
    { id: 'u5', name: 'Chef Luigi', email: 'luigi@example.com', role: 'manager', restaurant_id: 'r3' },
    { id: 'u6', name: 'Susana (Bar)', email: 'susana@example.com', role: 'staff', restaurant_id: 'r4' },
];

export const mockRestaurants: Restaurant[] = [
    { id: 'r1', name: 'Cocina Central', address: 'Av. Principal 123' },
    { id: 'r2', name: 'Sucursal Norte', address: 'Calle Norte 456' },
    { id: 'r3', name: 'Restaurante Italiano', address: 'Plaza Mayor 88' },
    { id: 'r4', name: 'Bar & Lounge', address: 'Zona Rosa 12' },
];

// R1: Cocina Central
// R2: Sucursal Norte

export const mockEquipment: Equipment[] = [
    // --- R1: Cocina Central ---
    { id: 'e1', code: 'REF-01', name: 'Refrigerador Principal', min_temp: 1, max_temp: 4, restaurant_id: 'r1' },
    { id: 'e2', code: 'CONG-01', name: 'Congelador Carnes', min_temp: -25, max_temp: -18, restaurant_id: 'r1' },
    { id: 'e3', code: 'LINEA-01', name: 'Mesa Fría Línea', min_temp: 2, max_temp: 5, restaurant_id: 'r1' },

    // --- R2: Sucursal Norte ---
    { id: 'e4', code: 'REF-N-01', name: 'Refrigerador Bebidas', min_temp: 1, max_temp: 4, restaurant_id: 'r2' },
    { id: 'e5', code: 'HORNO-N-01', name: 'Horno Industrial', min_temp: 180, max_temp: 220, restaurant_id: 'r2' },

    // --- R3: Restaurante Italiano ---
    { id: 'e6', code: 'CAM-01', name: 'Cámara de Fermentación', min_temp: 20, max_temp: 25, restaurant_id: 'r3' },
    { id: 'e7', code: 'REF-P-02', name: 'Refrigerador Pastas', min_temp: 1, max_temp: 4, restaurant_id: 'r3' },

    // --- R4: Bar & Lounge ---
    { id: 'e8', code: 'CAV-01', name: 'Cava de Vinos', min_temp: 10, max_temp: 14, restaurant_id: 'r4' },
    { id: 'e9', code: 'CONG-HI', name: 'Congelador Hielo', min_temp: -10, max_temp: -5, restaurant_id: 'r4' },
];

export const mockReadings: TemperatureReading[] = [
    // R1
    { id: 'l1', equipment_id: 'e1', value: 3.5, recorded_at: subMinutes(new Date(), 15).toISOString(), created_by: 'u2', snapshot_min_temp: 1, snapshot_max_temp: 4 },
    { id: 'l2', equipment_id: 'e1', value: 2.1, recorded_at: subHours(new Date(), 4).toISOString(), created_by: 'u1', snapshot_min_temp: 1, snapshot_max_temp: 4 },
    { id: 'l3', equipment_id: 'e2', value: -19.5, recorded_at: subMinutes(new Date(), 30).toISOString(), created_by: 'u1', snapshot_min_temp: -25, snapshot_max_temp: -18 },

    // R2 (Alerta)
    { id: 'l4', equipment_id: 'e5', value: 150, recorded_at: subMinutes(new Date(), 10).toISOString(), created_by: 'u3', snapshot_min_temp: 180, snapshot_max_temp: 220 },

    // R3
    { id: 'l5', equipment_id: 'e6', value: 22.5, recorded_at: subMinutes(new Date(), 5).toISOString(), created_by: 'u5', snapshot_min_temp: 20, snapshot_max_temp: 25 },
    { id: 'l6', equipment_id: 'e7', value: 3.0, recorded_at: subHours(new Date(), 1).toISOString(), created_by: 'u5', snapshot_min_temp: 1, snapshot_max_temp: 4 },

    // R4
    { id: 'l7', equipment_id: 'e8', value: 12.0, recorded_at: subMinutes(new Date(), 45).toISOString(), created_by: 'u6', snapshot_min_temp: 10, snapshot_max_temp: 14 },
    { id: 'l8', equipment_id: 'e9', value: -8.0, recorded_at: subMinutes(new Date(), 120).toISOString(), created_by: 'u6', snapshot_min_temp: -10, snapshot_max_temp: -5 },
];
