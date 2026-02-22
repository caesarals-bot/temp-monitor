import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Equipment, Restaurant, TemperatureReading, User, StaffMember } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useEquipment } from '@/hooks/useEquipment';
import { useReadings } from '@/hooks/useReadings';
import { useStaff } from '@/hooks/useStaff';

interface AppContextType {
    currentUser: User | null;
    restaurants: Restaurant[];
    userRestaurants: Restaurant[]; // Restaurantes del usuario actual
    currentRestaurant: Restaurant | null; // Restaurante seleccionado
    equipment: Equipment[];
    readings: TemperatureReading[];
    isLoading: boolean;
    isDataLoaded: boolean;
    globalError: string | null;

    // Actions
    login: (email: string, password?: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => Promise<void>;
    selectRestaurant: (restaurantId: string) => void;
    clearGlobalError: () => void;

    // ... (resto de acciones igual)
    addReading: (reading: Omit<TemperatureReading, 'id' | 'snapshot_min_temp' | 'snapshot_max_temp' | 'recorded_at' | 'created_by'> & { notes?: string, member_id?: string, created_by?: string }) => Promise<void>;
    getLastReading: (equipmentId: string) => TemperatureReading | undefined;

    // Admin Actions
    addEquipment: (equipment: Omit<Equipment, 'id'>) => Promise<void>;
    updateEquipment: (id: string, data: Partial<Equipment>) => Promise<void>;
    deleteEquipment: (id: string) => Promise<void>;

    addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => Promise<void>;
    users: User[];
    addUser: (user: Omit<User, 'id'>) => Promise<void>;

    // Staff Actions
    staff: StaffMember[];
    addStaff: (staff: Omit<StaffMember, 'id' | 'created_at' | 'active'>) => Promise<void>;
    updateStaff: (id: string, data: Partial<StaffMember>) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser, login, register, logout, authError, clearAuthError, isLoadingAuth, updateCurrentUser } = useAuth();

    // Instanciar custom hooks
    const {
        restaurants, setRestaurants,
        currentRestaurant, setCurrentRestaurant,
        selectRestaurant, addRestaurant
    } = useRestaurants(currentUser, updateCurrentUser);

    const {
        equipment, setEquipment,
        addEquipment, updateEquipment, deleteEquipment
    } = useEquipment();

    const {
        staff, setStaff,
        users,
        addStaff, updateStaff, deleteStaff, addUser
    } = useStaff();

    const {
        readings, setReadings,
        addReading, getLastReading
    } = useReadings(currentUser, equipment, staff, users);

    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const isLoading = isLoadingAuth || isLoadingData;
    const combinedError = globalError || authError;

    const clearGlobalError = () => {
        setGlobalError(null);
        clearAuthError();
    };

    // Derivar restaurantes del usuario
    const userRestaurants = restaurants.filter(r => {
        if (currentUser?.role === 'owner' || currentUser?.role === 'admin') {
            return r.organization_id === currentUser.restaurant_id;
        }
        return r.organization_id === currentUser?.restaurant_id;
    });

    // Fetch inicial de datos reales
    useEffect(() => {
        if (!currentUser) {
            setRestaurants([]);
            setEquipment([]);
            setReadings([]);
            setGlobalError(null);
            setIsLoadingData(false);
            return;
        }

        const fetchData = async () => {
            setIsLoadingData(true);
            setIsDataLoaded(false);
            setGlobalError(null);
            try {
                // Ejecutar todas las consultas en PARALELO para reducir el tiempo de carga drásticamente
                const [restResponse, eqResponse, staffResponse, readResponse] = await Promise.all([
                    supabase.from('restaurants').select('*'),
                    supabase.from('equipment').select('*'),
                    supabase.from('staff').select('*').eq('active', true),
                    supabase.from('temperature_readings').select('*').order('recorded_at', { ascending: false }).limit(100)
                ]);

                let hasError = false;

                if (restResponse.error) {
                    console.error("Error fetching restaurants:", restResponse.error);
                    hasError = true;
                } else {
                    setRestaurants(restResponse.data || []);
                }

                if (eqResponse.error) {
                    console.error("Error fetching equipment:", eqResponse.error);
                } else {
                    setEquipment(eqResponse.data || []);
                }

                if (staffResponse.error) {
                    console.warn("Error fetching staff:", staffResponse.error);
                } else {
                    setStaff(staffResponse.data || []);
                }

                if (readResponse.error) {
                    console.error("Error fetching readings:", readResponse.error);
                } else {
                    setReadings(readResponse.data || []);
                }

                if (hasError) {
                    setGlobalError("No hemos podido cargar algunos datos. Por favor, verifica tu conexión.");
                } else {
                    setIsDataLoaded(true);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setGlobalError("Problema de conexión al obtener tus datos principales.");
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchData();
    }, [currentUser]);

    // Actualizar currentRestaurant cuando cambia el usuario o sus restaurantes
    useEffect(() => {
        if (currentUser && userRestaurants.length > 0 && !currentRestaurant) {
            setCurrentRestaurant(userRestaurants[0]);
        } else if (!currentUser) {
            setCurrentRestaurant(null);
        }
    }, [currentUser, userRestaurants, currentRestaurant]);

    return (
        <AppContext.Provider value={{
            currentUser,
            restaurants,
            userRestaurants,
            currentRestaurant,
            equipment,
            readings,
            isLoading,
            isDataLoaded,
            globalError: combinedError,
            login,
            register,
            logout,
            selectRestaurant,
            clearGlobalError,
            addReading,
            getLastReading,
            addEquipment,
            updateEquipment,
            deleteEquipment,
            addRestaurant,
            users,
            addUser,
            staff,
            addStaff,
            updateStaff,
            deleteStaff
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
