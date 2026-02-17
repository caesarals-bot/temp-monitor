import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Equipment, Restaurant, TemperatureReading, User } from '@/types';
import { supabase } from '@/lib/supabase';

// ... imports

interface AppContextType {
    currentUser: User | null;
    restaurants: Restaurant[];
    userRestaurants: Restaurant[]; // Restaurantes del usuario actual
    currentRestaurant: Restaurant | null; // Restaurante seleccionado
    equipment: Equipment[];
    readings: TemperatureReading[];
    isLoading: boolean;

    // Actions
    login: (email: string, password?: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
    selectRestaurant: (restaurantId: string) => void;

    // ... (resto de acciones igual)
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
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [readings, setReadings] = useState<TemperatureReading[]>([]);
    const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);

    // Derivar restaurantes del usuario
    // Derivar restaurantes del usuario
    const userRestaurants = restaurants.filter(r => {
        // Si el usuario es Owner/Admin, ve todos los de su organización
        if (currentUser?.role === 'owner' || currentUser?.role === 'admin') {
            return r.organization_id === currentUser.restaurant_id; // restaurant_id en User es OrganizationID
        }
        // Si es manager/staff, debería ver solo los asignados (PENDIENTE: traer assignments de DB)
        // Por ahora, fallback a la misma lógica de organización para no romper el flujo
        return r.organization_id === currentUser?.restaurant_id;
    });
    // NOTA: La lógica real de "qué restaurantes ve un usuario" dependerá de la tabla intermedia en Supabase.
    // Por ahora en el mock, si es admin ve todos, si no, ve el asignado.
    // Para simplificar el onboarding, asumiremos que si crea uno, es suyo.

    // Fetch inicial de datos reales
    useEffect(() => {
        if (!currentUser) {
            setRestaurants([]);
            setEquipment([]);
            setReadings([]);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Restaurants (RLS filtrará por mi)
                const { data: restData, error: restError } = await supabase
                    .from('restaurants')
                    .select('*');

                if (restError) throw restError;
                setRestaurants(restData || []);

                // 2. Fetch Equipment (RLS filtrará por mis restaurantes)
                const { data: eqData, error: eqError } = await supabase
                    .from('equipment')
                    .select('*');

                if (eqError) throw eqError;
                setEquipment(eqData || []);

                // 3. Fetch Readings (RLS filtrará)
                // Limitamos a las últimas 100 por ahora para no saturar
                const { data: readData, error: readError } = await supabase
                    .from('temperature_readings')
                    .select('*')
                    .order('recorded_at', { ascending: false })
                    .limit(100);

                if (readError) throw readError;
                setReadings(readData || []);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    // Actualizar currentRestaurant cuando cambia el usuario o sus restaurantes
    useEffect(() => {
        if (currentUser && userRestaurants.length > 0 && !currentRestaurant) {
            // Por defecto seleccionar el primero
            setCurrentRestaurant(userRestaurants[0]);
        } else if (!currentUser) {
            setCurrentRestaurant(null);
        }
    }, [currentUser, userRestaurants, currentRestaurant]);

    const [isLoading, setIsLoading] = useState(true);

    // ... (rest of states)

    // ... (derivation logic)

    useEffect(() => {
        // ... (mock data setup)
    }, []);

    // ... (currentRestaurant logic)

    // Escuchar cambios de sesión de Supabase
    useEffect(() => {
        const fetchProfile = async (userId: string) => {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                if (error) {
                    console.error("Error fetching profile:", error);
                    return null;
                }
                return data;
            } catch (e) {
                console.error("Exception fetching profile", e);
                return null;
            }
        };

        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const profile = await fetchProfile(session.user.id);
                    if (profile) {
                        const user: User = {
                            id: profile.id,
                            email: profile.email,
                            name: profile.full_name || 'Usuario',
                            role: profile.role as any, // Cast temporal
                            restaurant_id: profile.organization_id // Mapeo temporal
                        };
                        setCurrentUser(user);
                    }
                }
            } catch (error) {
                console.error("Error initializing auth:", error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                // setIsLoading(true); // Optional: show loading while switching user
                const profile = await fetchProfile(session.user.id);
                if (profile) {
                    const user: User = {
                        id: profile.id,
                        email: profile.email,
                        name: profile.full_name || 'Usuario',
                        role: profile.role as any,
                        restaurant_id: profile.organization_id
                    };
                    setCurrentUser(user);
                }
                setIsLoading(false);
            } else if (event === 'SIGNED_OUT') {
                setCurrentUser(null);
                setCurrentRestaurant(null);
                setIsLoading(false);
            } else if (event === 'INITIAL_SESSION') {
                // Handled by initAuth mostly, but good safety
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password?: string) => {
        if (!password) {
            throw new Error("Se requiere contraseña para Supabase Auth");
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        // Force fetch profile to update state immediately
        if (data.session?.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.session.user.id)
                .single();

            if (profile) {
                const user: User = {
                    id: profile.id,
                    email: profile.email,
                    name: profile.full_name || 'Usuario',
                    role: profile.role as any,
                    restaurant_id: profile.organization_id
                };
                setCurrentUser(user);
            }
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setCurrentRestaurant(null);
    };

    const register = async (email: string, password: string, fullName: string) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                }
            }
        });
        if (authError) throw authError;

        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', authData.user.id);

            if (profileError) console.error("Error updating profile name:", profileError);
        }
    };

    const selectRestaurant = (restaurantId: string) => {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (restaurant) {
            setCurrentRestaurant(restaurant);
        }
    };

    const addReading = async (newReadingData: Omit<TemperatureReading, 'id' | 'snapshot_min_temp' | 'snapshot_max_temp' | 'recorded_at'>) => {
        const targetEquipment = equipment.find(e => e.id === newReadingData.equipment_id);
        if (!targetEquipment) throw new Error("Equipo no encontrado");

        const createdBy = newReadingData.created_by || currentUser?.id;
        if (!createdBy) throw new Error("No hay usuario autenticado ni seleccionado");

        const { data, error } = await supabase
            .from('temperature_readings')
            .insert({
                equipment_id: newReadingData.equipment_id,
                value: newReadingData.value,
                notes: newReadingData.notes,
                created_by: createdBy,
                snapshot_min_temp: targetEquipment.min_temp, // Nota: Estos campos no existen en la tabla real por defecto según schema, 
                // pero el tipo los pide. Si no están en DB, Supabase los ignorará o dará error.
                // Revisando schema: NO existen. Solo equipment_id, value, notes.
                // Ajustaremos el insert para mandar solo lo que existe.
            })
            .select()
            .single();

        if (error) throw error;

        // Mapear respuesta a tipo Frontend
        const newReading: TemperatureReading = {
            id: data.id,
            equipment_id: data.equipment_id,
            value: data.value,
            notes: data.notes,
            created_by: data.created_by,
            recorded_at: data.recorded_at,
            snapshot_min_temp: targetEquipment.min_temp, // En frontend los mantenemos para UI
            snapshot_max_temp: targetEquipment.max_temp,
        };

        setReadings(prev => [newReading, ...prev]);
    };

    const getLastReading = (equipmentId: string) => {
        return readings
            .filter(r => r.equipment_id === equipmentId)
            .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];
    };

    const addEquipment = async (data: Omit<Equipment, 'id'>) => {
        const { data: newEq, error } = await supabase
            .from('equipment')
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        setEquipment(prev => [...prev, newEq as Equipment]);
    };

    const updateEquipment = async (id: string, data: Partial<Equipment>) => {
        const { error } = await supabase
            .from('equipment')
            .update(data)
            .eq('id', id);

        if (error) throw error;
        setEquipment(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    };

    const deleteEquipment = async (id: string) => {
        const { error } = await supabase
            .from('equipment')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setEquipment(prev => prev.filter(e => e.id !== id));
    };

    const addUser = async (data: Omit<User, 'id'>) => {
        // TODO: Implementar invitación real de Supabase Auth
        console.warn("addUser: Solo actualiza estado local. En producción usar Invitaciones de Supabase.");
        const newUser: User = { ...data, id: crypto.randomUUID() };
        setUsers(prev => [...prev, newUser]);
    };

    const addRestaurant = async (data: Omit<Restaurant, 'id'>) => {
        if (!currentUser) throw new Error("No user");

        // 1. Si el usuario NO tiene organización, creamos una (Logica de Onboarding)
        let orgId = currentUser.restaurant_id; // Mapping temporal: restaurant_id en User es organization_id en DB

        if (!orgId) {
            const { data: newOrg, error: orgError } = await supabase
                .from('organizations')
                .insert({ name: data.name }) // Usamos el nombre del restaurante como nombre de org inicial
                .select()
                .single();

            if (orgError) throw orgError;
            orgId = newOrg.id;

            // Actualizar perfil del usuario a owner de esta org
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    organization_id: orgId,
                    role: 'owner'
                })
                .eq('id', currentUser.id);

            if (profileError) throw profileError;

            // Actualizar estado local
            setCurrentUser(prev => prev ? { ...prev, restaurant_id: orgId, role: 'owner' } : null);
        }

        // 2. Crear el Restaurante
        const { data: newRestaurant, error: restError } = await supabase
            .from('restaurants')
            .insert({
                name: data.name,
                address: data.address,
                organization_id: orgId
            })
            .select()
            .single();

        if (restError) throw restError;

        // 3. Actualizar estado local
        const mappedRestaurant: Restaurant = {
            id: newRestaurant.id,
            name: newRestaurant.name,
            address: newRestaurant.address,
            organization_id: newRestaurant.organization_id
        };

        setRestaurants(prev => [...prev, mappedRestaurant]);

        // Seleccionarlo si es el único
        if (!currentRestaurant) {
            setCurrentRestaurant(mappedRestaurant);
        }
    };

    // ... (Resto de providers)

    return (
        <AppContext.Provider value={{
            currentUser,
            restaurants,
            userRestaurants,
            currentRestaurant,
            equipment,
            readings,
            isLoading,
            login,
            register,
            logout,
            selectRestaurant,
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
