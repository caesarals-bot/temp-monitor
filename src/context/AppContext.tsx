import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Equipment, Restaurant, TemperatureReading, User } from '@/types';
import { mockEquipment, mockReadings, mockUsers, mockRestaurants } from '@/mocks';

interface AppContextType {
    currentUser: User | null;
    restaurants: Restaurant[];
    equipment: Equipment[];
    readings: TemperatureReading[];

    // Actions
    addReading: (reading: Omit<TemperatureReading, 'id' | 'snapshot_min_temp' | 'snapshot_max_temp' | 'recorded_at'>) => Promise<void>;
    getLastReading: (equipmentId: string) => TemperatureReading | undefined;

    // Admin Actions
    addEquipment: (equipment: Omit<Equipment, 'id'>) => Promise<void>;
    updateEquipment: (id: string, data: Partial<Equipment>) => Promise<void>;
    deleteEquipment: (id: string) => Promise<void>;

    addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => Promise<void>;
    users: User[];
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser] = useState<User>(mockUsers[0]); // Simular usuario logueado
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [readings, setReadings] = useState<TemperatureReading[]>([]);

    // Cargar mocks iniciales
    useEffect(() => {
        setRestaurants(mockRestaurants);
        setEquipment(mockEquipment);
        setReadings(mockReadings);
        setUsers(mockUsers);
    }, []);

    const addReading = async (newReadingData: Omit<TemperatureReading, 'id' | 'snapshot_min_temp' | 'snapshot_max_temp' | 'recorded_at'>) => {
        // Simular retardo de red
        await new Promise(resolve => setTimeout(resolve, 500));

        const targetEquipment = equipment.find(e => e.id === newReadingData.equipment_id);
        if (!targetEquipment) throw new Error("Equipo no encontrado");

        // Use provided created_by or fallback to currentUser
        const createdBy = newReadingData.created_by || currentUser?.id;
        if (!createdBy) throw new Error("No hay usuario autenticado ni seleccionado");

        const newReading: TemperatureReading = {
            ...newReadingData,
            created_by: createdBy, // Ensure we use the resolved ID
            id: crypto.randomUUID(),
            recorded_at: new Date().toISOString(),
            snapshot_min_temp: targetEquipment.min_temp,
            snapshot_max_temp: targetEquipment.max_temp,
        };

        setReadings(prev => [newReading, ...prev]);
    };

    const getLastReading = (equipmentId: string) => {
        return readings
            .filter(r => r.equipment_id === equipmentId)
            .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];
    };

    // --- Admin Functions ---

    const addEquipment = async (data: Omit<Equipment, 'id'>) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newEquipment: Equipment = { ...data, id: crypto.randomUUID() };
        setEquipment(prev => [...prev, newEquipment]);
    };

    const updateEquipment = async (id: string, data: Partial<Equipment>) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        setEquipment(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    };

    const deleteEquipment = async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        setEquipment(prev => prev.filter(e => e.id !== id));
    };

    const addRestaurant = async (data: Omit<Restaurant, 'id'>) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newRestaurant: Restaurant = { ...data, id: crypto.randomUUID() };
        setRestaurants(prev => [...prev, newRestaurant]);
    };

    const addUser = async (data: Omit<User, 'id'>) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newUser: User = { ...data, id: crypto.randomUUID() };
        setUsers(prev => [...prev, newUser]);
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            restaurants,
            equipment,
            readings,
            addReading,
            getLastReading,
            addEquipment,
            updateEquipment,
            deleteEquipment,
            addRestaurant,
            users,
            addUser
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
