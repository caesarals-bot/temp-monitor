import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { TemperatureReading, Equipment, StaffMember, User } from '@/types';

export function useReadings(currentUser: any, equipment: Equipment[], staff: StaffMember[], users: User[]) {
    const [readings, setReadings] = useState<TemperatureReading[]>([]);

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

    return {
        readings,
        setReadings,
        addReading,
        getLastReading
    };
}
