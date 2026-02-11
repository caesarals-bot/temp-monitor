export interface Equipment {
    id: string;
    code: string; // ID personalizado (ej. C001)
    name: string;
    min_temp: number;
    max_temp: number;
    restaurant_id: string;
}

export interface TemperatureReading {
    id: string;
    equipment_id: string;
    value: number;
    recorded_at: string; // ISO String
    notes?: string;
    snapshot_min_temp: number; // Rango en el momento de la toma
    snapshot_max_temp: number;
    created_by: string; // ID del usuario que registró la toma
}

export interface Restaurant {
    id: string;
    name: string;
    address?: string; // Opcional por ahora
}

export interface User {
    id: string;
    name: string;
    role: 'admin' | 'manager' | 'staff';
    restaurant_id?: string; // Vincula al usuario con una sucursal
}
