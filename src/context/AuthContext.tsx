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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const clearAuthError = () => setAuthError(null);

    useEffect(() => {
        const fetchProfile = async (userId: string) => {
            try {
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Timeout fetching profile")), 15000)
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
                            role: profile.role as any,
                            restaurant_id: profile.organization_id,
                            is_platform_admin: profile.is_platform_admin === true
                        };
                        setCurrentUser(user);
                    } else {
                        setAuthError("No pudimos cargar tu perfil. Revisa tu conexión a internet.");
                    }
                }
            } catch (error) {
                console.error("Error initializing auth:", error);
                setAuthError("Ocurrió un error al verificar tu sesión.");
            } finally {
                setIsLoadingAuth(false);
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
            } else if (event === 'SIGNED_OUT') {
                setCurrentUser(null);
                setAuthError(null);
                setIsLoadingAuth(false);
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

    return (
        <AuthContext.Provider value={{
            currentUser,
            isLoadingAuth,
            authError,
            login,
            register,
            logout,
            clearAuthError,
            updateCurrentUser
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
