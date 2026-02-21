import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useApp } from '@/context/AppContext';
import type { Organization } from '@/types';

export interface AdminStats {
    totalOrganizations: number;
    totalRestaurants: number;
    totalUsers: number;
}

export function useSuperAdmin() {
    const { currentUser } = useApp();
    const [stats, setStats] = useState<AdminStats>({ totalOrganizations: 0, totalRestaurants: 0, totalUsers: 0 });
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [globalUsers, setGlobalUsers] = useState<any[]>([]);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    const isPlatformAdmin = currentUser?.is_platform_admin === true;

    const fetchGlobalStats = async () => {
        if (!isPlatformAdmin) return;
        setIsLoadingStats(true);

        try {
            // Nota: En producción, `count: 'exact'` con RLS apropiado para admin
            const [orgsResponse, restResponse, usersResponse] = await Promise.all([
                supabase.from('organizations').select('*', { count: 'exact', head: true }),
                supabase.from('restaurants').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true })
            ]);

            setStats({
                totalOrganizations: orgsResponse.count || 0,
                totalRestaurants: restResponse.count || 0,
                totalUsers: usersResponse.count || 0
            });

        } catch (error) {
            console.error("Error fetching admin stats:", error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const fetchOrganizations = async () => {
        if (!isPlatformAdmin) return;
        setIsLoadingOrgs(true);
        try {
            const { data, error } = await supabase
                .from('organizations')
                .select('*')
                .order('name');

            if (error) throw error;
            setOrganizations(data || []);
        } catch (error) {
            console.error("Error fetching organizations:", error);
        } finally {
            setIsLoadingOrgs(false);
        }
    };

    const updateOrganizationStatus = async (orgId: string, status: 'active' | 'paused' | 'suspended') => {
        try {
            const { error } = await supabase
                .from('organizations')
                .update({ status })
                .eq('id', orgId);

            if (error) throw error;
            setOrganizations(prev => prev.map(o => o.id === orgId ? { ...o, status } : o));
        } catch (error) {
            console.error("Error updating status:", error);
            throw error;
        }
    };

    const updateMaxRestaurants = async (orgId: string, maxRestaurants: number) => {
        try {
            const { error } = await supabase
                .from('organizations')
                .update({ max_restaurants: maxRestaurants })
                .eq('id', orgId);

            if (error) throw error;
            setOrganizations(prev => prev.map(o => o.id === orgId ? { ...o, max_restaurants: maxRestaurants } : o));
        } catch (error) {
            console.error("Error updating max restaurants:", error);
            throw error;
        }
    };

    const fetchGlobalUsers = async () => {
        if (!isPlatformAdmin) return;
        setIsLoadingUsers(true);
        try {
            // Unimos con organizations para mostrar el nombre del tenant en la tabla
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id, 
                    full_name, 
                    email, 
                    role, 
                    is_platform_admin,
                    organizations ( id, name, status )
                `);

            if (error) throw error;
            setGlobalUsers(data || []);
        } catch (error) {
            console.error("Error fetching global users:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const forcePasswordReset = async (email: string) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error sending reset email:", error);
            throw error;
        }
    };

    return {
        isPlatformAdmin,
        stats,
        organizations,
        globalUsers,
        isLoadingStats,
        isLoadingOrgs,
        isLoadingUsers,
        fetchGlobalStats,
        fetchOrganizations,
        updateOrganizationStatus,
        updateMaxRestaurants,
        fetchGlobalUsers,
        forcePasswordReset
    };
}
