import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Restaurant } from '@/types';

export function useRestaurants(currentUser: any, updateCurrentUser: (data: any) => void) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);

    const selectRestaurant = (restaurantId: string) => {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (restaurant) {
            setCurrentRestaurant(restaurant);
        }
    };

    const addRestaurant = async (data: Omit<Restaurant, 'id'>) => {
        if (!currentUser) throw new Error("No user");

        let orgId = currentUser.restaurant_id;

        if (!orgId) {
            const { data: newOrg, error: orgError } = await supabase
                .from('organizations')
                .insert({ name: data.name })
                .select()
                .single();

            if (orgError) throw orgError;
            orgId = newOrg.id;

            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    organization_id: orgId,
                    role: 'owner'
                })
                .eq('id', currentUser.id);

            if (profileError) throw profileError;

            updateCurrentUser({ restaurant_id: orgId, role: 'owner' });
        }

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

        const mappedRestaurant: Restaurant = {
            id: newRestaurant.id,
            name: newRestaurant.name,
            address: newRestaurant.address,
            organization_id: newRestaurant.organization_id
        };

        setRestaurants(prev => [...prev, mappedRestaurant]);

        if (!currentRestaurant) {
            setCurrentRestaurant(mappedRestaurant);
        }
    };

    return {
        restaurants,
        setRestaurants,
        currentRestaurant,
        setCurrentRestaurant,
        selectRestaurant,
        addRestaurant
    };
}
