import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Equipment, Restaurant, TemperatureReading, User, StaffMember } from '@/types';
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
    isDataLoaded: boolean;

    // Actions
    login: (email: string, password?: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => void;
    selectRestaurant: (restaurantId: string) => void;

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
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
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
            setIsDataLoaded(false);
            try {
                // Ejecutar todas las consultas en PARALELO para reducir el tiempo de carga drásticamente
                const [restResponse, eqResponse, staffResponse, readResponse] = await Promise.all([
                    supabase.from('restaurants').select('*'),
                    supabase.from('equipment').select('*'),
                    supabase.from('staff').select('*').eq('active', true),
                    supabase.from('temperature_readings').select('*').order('recorded_at', { ascending: false }).limit(100)
                ]);

                // 1. Manejo de Restaurants
                if (restResponse.error) throw restResponse.error;
                setRestaurants(restResponse.data || []);

                // 2. Manejo de Equipment
                if (eqResponse.error) throw eqResponse.error;
                setEquipment(eqResponse.data || []);

                // 2.5 Manejo de Staff
                if (staffResponse.error) {
                    console.warn("Error fetching staff:", staffResponse.error);
                } else {
                    setStaff(staffResponse.data || []);
                }

                // 3. Manejo de Readings
                if (readResponse.error) throw readResponse.error;
                setReadings(readResponse.data || []);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
                setIsDataLoaded(true);
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
    const [isDataLoaded, setIsDataLoaded] = useState(false);

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
                // Timeout para fetchProfile MUCHO MÁS CORTO (5s en lugar de 15s)
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout fetching profile")), 5000)
                );

                const dataPromise = supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();

                const { data, error } = await Promise.race([dataPromise, timeoutPromise]) as any;

                if (error) {
                    console.error("Error fetching profile (or timeout):", error);
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
                            restaurant_id: profile.organization_id, // Mapeo temporal
                            is_platform_admin: profile.is_platform_admin === true
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
                const profile = await fetchProfile(session.user.id);

                if (profile) {
                    const user: User = {
                        id: profile.id,
                        email: profile.email,
                        name: profile.full_name || 'Usuario',
                        role: profile.role as any,
                        restaurant_id: profile.organization_id,
                        is_platform_admin: profile.is_platform_admin === true
                    };
                    setCurrentUser(user);
                } else {
                    // Fallback si no hay perfil (para no bloquear)
                    console.warn("No profile found, using fallback user data");
                    const user: User = {
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.full_name || 'Usuario',
                        role: 'staff', // Rol por defecto seguro
                        restaurant_id: '', // Sin org
                        is_platform_admin: false
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

        // Timeout wrapper solo para la llamada de auth
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("TIMEOUT_ERROR")), 10000); // 10s timeout reducid
        });

        const authPromise = supabase.auth.signInWithPassword({
            email,
            password,
        });

        try {
            const result = await Promise.race([authPromise, timeoutPromise]) as any;

            const { error } = result;
            if (error) throw error;

        } catch (error: any) {

            if (error.message === "TIMEOUT_ERROR") {
                // Si hubo timeout, verificar si realmente estamos logueados
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    return; // Éxito silencioso
                }
                throw new Error("Tiempo de espera agotado y no se pudo verificar la sesión. Revisa tu conexión.");
            }

            throw error;
        }

        // No forzamos fetchProfile aquí, dejamos que onAuthStateChange lo haga
        // para evitar condiciones de carrera o bloqueos.
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

    const addReading = async (newReadingData: Omit<TemperatureReading, 'id' | 'snapshot_min_temp' | 'snapshot_max_temp' | 'recorded_at' | 'created_by'> & { notes?: string, member_id?: string, created_by?: string }) => {
        const targetEquipment = equipment.find(e => e.id === newReadingData.equipment_id);
        if (!targetEquipment) throw new Error("Equipo no encontrado");

        const createdBy = currentUser?.id;
        if (!createdBy) throw new Error("No hay usuario autenticado");

        // Resolver taken_by
        let takenByName = currentUser.name; // Fallback
        if (newReadingData.member_id) {
            const staffMember = staff.find(s => s.id === newReadingData.member_id);
            if (staffMember) {
                takenByName = staffMember.name;
            } else {
                const userMember = users.find(u => u.id === newReadingData.member_id);
                if (userMember) {
                    takenByName = userMember.name;
                } else if (newReadingData.member_id === currentUser.id) {
                    takenByName = currentUser.name;
                }
            }
        }

        const { data, error } = await supabase
            .from('temperature_readings')
            .insert({
                equipment_id: newReadingData.equipment_id,
                value: newReadingData.value,
                notes: newReadingData.notes,
                created_by: createdBy, // Always the auth user
                taken_by: takenByName, // The name of who took it
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
            taken_by: data.taken_by,
            recorded_at: data.recorded_at,
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
        if (!currentRestaurant) {
            setCurrentRestaurant(mappedRestaurant);
        }
    };

    const addStaff = async (data: Omit<StaffMember, 'id' | 'created_at' | 'active'>) => {
        const { data: newStaff, error } = await supabase
            .from('staff')
            .insert({ ...data, active: true })
            .select()
            .single();

        if (error) throw error;
        setStaff(prev => [...prev, newStaff as StaffMember]);
    };

    const updateStaff = async (id: string, data: Partial<StaffMember>) => {
        const { error } = await supabase
            .from('staff')
            .update(data)
            .eq('id', id);

        if (error) throw error;
        setStaff(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    };

    const deleteStaff = async (id: string) => {
        // Soft delete
        const { error } = await supabase
            .from('staff')
            .update({ active: false })
            .eq('id', id);

        if (error) throw error;
        setStaff(prev => prev.filter(s => s.id !== id));
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
            isDataLoaded,
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
