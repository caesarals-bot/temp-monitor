import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Equipment } from '@/types';

export function useEquipment() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);

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

    return {
        equipment,
        setEquipment,
        addEquipment,
        updateEquipment,
        deleteEquipment
    };
}
