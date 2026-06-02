import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    currentUser: User | null;
    isLoadingAuth: boolean;
    authError: string | null;
    login: (email: string, password?: string) => Promise<void>;
    register: (email: string, password: string, fullName: string) => Promise<void>;
    logout: () => Promise<void>;
    clearAuthError: () => void;
    updateCurrentUser: (data: Partial<User>) => void;
    forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const clearAuthError = () => setAuthError(null);

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async (userId: string, retries = 3): Promise<any> => {
            for (let i = 0; i < retries; i++) {
                try {
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("Timeout fetching profile")), 12000)
                    );

                    const dataPromise = supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', userId)
                        .single();

                    const result = await Promise.race([dataPromise, timeoutPromise]) as any;

                    if (result.error) {
                        console.warn(`Intento ${i + 1} - Error al obtener perfil:`, result.error);
                        if (i === retries - 1) return null;
                    } else if (result.data) {
                        return result.data;
                    }
                } catch (e) {
                    console.warn(`Intento ${i + 1} - Excepción al obtener perfil:`, e);
                    if (i === retries - 1) return null;
                }

                // Pausa antes de reintentar (1s, 2s, 3s...)
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
            return null;
        };

        const handleAuthSession = async (session: any) => {
            if (!session?.user) {
                if (isMounted) {
                    setCurrentUser(null);
                    setAuthError(null);
                    setIsLoadingAuth(false);
                }
                return;
            }

            const profile = await fetchProfile(session.user.id);

            if (!isMounted) return;

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
                setAuthError(null);
            } else {
                console.warn("No profile found, not using fallback to avoid false onboarding.");
                setAuthError("Inicio de sesión parcial: No se pudo cargar tu perfil al completo.");

                const user: User = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || 'Usuario',
                    role: 'staff',
                    restaurant_id: '',
                    is_platform_admin: false
                };
                setCurrentUser(user);
            }
            setIsLoadingAuth(false);
        };

        // Solicitar sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleAuthSession(session);
        });

        // Escuchar cambios de sesión
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                handleAuthSession(session);
            } else if (event === 'SIGNED_OUT') {
                if (isMounted) {
                    setCurrentUser(null);
                    setAuthError(null);
                    setIsLoadingAuth(false);
                }
            }
        });

        return () => {
            isMounted = false;
            authListener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password?: string) => {
        if (!password) {
            throw new Error("Se requiere contraseña para Supabase Auth");
        }

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("TIMEOUT_ERROR")), 15000);
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
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) return;
                throw new Error("Tiempo de espera agotado y no se pudo verificar la sesión. Revisa tu conexión.");
            }
            throw error;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setAuthError(null);
    };

    const updateCurrentUser = (data: Partial<User>) => {
        setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    };

    const register = async (email: string, password: string, fullName: string) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName }
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

    const forgotPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            isLoadingAuth,
            authError,
            login,
            register,
            logout,
            clearAuthError,
            updateCurrentUser,
            forgotPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
