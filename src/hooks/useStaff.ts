import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { StaffMember, User } from '@/types';

export function useStaff() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [users, setUsers] = useState<User[]>([]);

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

    const addUser = async (data: Omit<User, 'id'>) => {
        // TODO: Implementar invitación real de Supabase Auth
        console.warn("addUser: Solo actualiza estado local. En producción usar Invitaciones de Supabase.");
        const newUser: User = { ...data, id: crypto.randomUUID() };
        setUsers(prev => [...prev, newUser]);
    };

    return {
        staff,
        setStaff,
        users,
        setUsers,
        addStaff,
        updateStaff,
        deleteStaff,
        addUser
    };
}
