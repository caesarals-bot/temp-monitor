
-- SQL Script to seed test data for Reports verification
-- Run this in the Supabase SQL Editor

DO $$
DECLARE
    -- IDs from your screenshot
    v_user_id uuid := '61e3c6b9-9e70-4866-b21c-816888456978'; 
    v_org_id uuid := '149050c9-2419-44bc-8ad6-61bcc9ddea43';
    
    -- Variables for generated/fetched IDs
    v_restaurant_id uuid;
    v_equip_fridge_id uuid;
    v_equip_freezer_id uuid;
    v_now timestamptz := now();
BEGIN
    -- 0. Ensure Snapshot Columns Exist (Since they are missing in your DB)
    -- This adds them if they don't exist, to support the reports logic
    BEGIN
        ALTER TABLE public.temperature_readings ADD COLUMN snapshot_min_temp numeric;
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'column snapshot_min_temp already exists in temperature_readings.';
    END;

    BEGIN
        ALTER TABLE public.temperature_readings ADD COLUMN snapshot_max_temp numeric;
    EXCEPTION
        WHEN duplicate_column THEN RAISE NOTICE 'column snapshot_max_temp already exists in temperature_readings.';
    END;

    -- 1. Get or Create Restaurant for the Organization
    SELECT id INTO v_restaurant_id FROM public.restaurants WHERE organization_id = v_org_id LIMIT 1;
    
    IF v_restaurant_id IS NULL THEN
        RAISE NOTICE 'Creating new restaurant...';
        INSERT INTO public.restaurants (organization_id, name, address, created_at)
        VALUES (v_org_id, 'Restaurante Principal', 'Calle Falsa 123', v_now)
        RETURNING id INTO v_restaurant_id;
    ELSE
         RAISE NOTICE 'Using existing restaurant ID: %', v_restaurant_id;
    END IF;

    -- 2. Get or Create Equipment 1: Cámara Fría (0°C to 5°C)
    SELECT id INTO v_equip_fridge_id FROM public.equipment WHERE restaurant_id = v_restaurant_id AND name = 'Cámara Fría' LIMIT 1;
    
    IF v_equip_fridge_id IS NULL THEN
        RAISE NOTICE 'Creating equipment: Cámara Fría...';
        INSERT INTO public.equipment (restaurant_id, name, min_temp, max_temp)
        VALUES (v_restaurant_id, 'Cámara Fría', 0, 5)
        RETURNING id INTO v_equip_fridge_id;
    END IF;

    -- 3. Get or Create Equipment 2: Congelador (-25°C to -15°C)
    SELECT id INTO v_equip_freezer_id FROM public.equipment WHERE restaurant_id = v_restaurant_id AND name = 'Congelador' LIMIT 1;
    
    IF v_equip_freezer_id IS NULL THEN
        RAISE NOTICE 'Creating equipment: Congelador...';
        INSERT INTO public.equipment (restaurant_id, name, min_temp, max_temp)
        VALUES (v_restaurant_id, 'Congelador', -25, -15)
        RETURNING id INTO v_equip_freezer_id;
    END IF;

    -- 4. INSERT TEMPERATURE READINGS (Last 7 days)
    
    -- Readings for Cámara Fría
    INSERT INTO public.temperature_readings (equipment_id, value, recorded_at, created_by, snapshot_min_temp, snapshot_max_temp, notes, taken_by)
    VALUES
    (v_equip_fridge_id, 2.5, v_now - interval '7 days', v_user_id, 0, 5, 'Inicio de semana', 'Augusto'),
    (v_equip_fridge_id, 3.2, v_now - interval '6 days 4 hours', v_user_id, 0, 5, NULL, 'Augusto'),
    (v_equip_fridge_id, 4.1, v_now - interval '5 days 2 hours', v_user_id, 0, 5, NULL, 'Augusto'),
    (v_equip_fridge_id, 1.5, v_now - interval '4 days', v_user_id, 0, 5, 'Limpieza realizada', 'Augusto'),
    (v_equip_fridge_id, 6.2, v_now - interval '3 days 6 hours', v_user_id, 0, 5, 'ALERTA: Puerta abierta mucho tiempo', 'Augusto'), -- Alert!
    (v_equip_fridge_id, 3.8, v_now - interval '2 days', v_user_id, 0, 5, NULL, 'Augusto'),
    (v_equip_fridge_id, 2.1, v_now - interval '1 day', v_user_id, 0, 5, NULL, 'Augusto');

    -- Readings for Congelador
    INSERT INTO public.temperature_readings (equipment_id, value, recorded_at, created_by, snapshot_min_temp, snapshot_max_temp, notes, taken_by)
    VALUES
    (v_equip_freezer_id, -18.5, v_now - interval '7 days 2 hours', v_user_id, -25, -15, NULL, 'Augusto'),
    (v_equip_freezer_id, -20.0, v_now - interval '6 days 1 hour', v_user_id, -25, -15, NULL, 'Augusto'),
    (v_equip_freezer_id, -22.1, v_now - interval '5 days 5 hours', v_user_id, -25, -15, NULL, 'Augusto'),
    (v_equip_freezer_id, -14.5, v_now - interval '4 days', v_user_id, -25, -15, 'ALERTA: Revisar termostato', 'Augusto'), -- Alert!
    (v_equip_freezer_id, -19.0, v_now - interval '3 days', v_user_id, -25, -15, NULL, 'Augusto'),
    (v_equip_freezer_id, -21.5, v_now - interval '1 day 12 hours', v_user_id, -25, -15, NULL, 'Augusto');

    RAISE NOTICE 'Test data inserted successfully!';
END $$;
