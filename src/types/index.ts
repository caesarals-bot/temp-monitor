export interface Equipment {
    id: string;
    code?: string; // ID personalizado (ej. C001) - Opcional, no en DB
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
    taken_by?: string; // Nombre de quien tomó la lectura
    snapshot_min_temp?: number; // Rango en el momento de la toma
    snapshot_max_temp?: number;
    created_by: string; // ID del usuario que registró la toma
}

export interface Organization {
    id: string;
    name: string;
    status?: 'active' | 'paused' | 'suspended';
    plan_type?: string;
    max_restaurants?: number;
}

export interface Restaurant {
    id: string;
    name: string;
    address?: string;
    organization_id?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'owner' | 'admin' | 'manager' | 'staff';
    restaurant_id?: string; // En Supabase esto mapea a organization_id
    is_platform_admin?: boolean; // Nuevo campo para Super Admin
}

export interface StaffMember {
    id: string;
    restaurant_id: string;
    name: string;
    role: string;
    active: boolean;
    created_at?: string;
}
