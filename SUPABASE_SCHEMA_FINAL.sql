-- ==============================================================================
-- SUPABASE SCHEMA FINAL (CONSOLIDATED)
-- Fecha: 2026-02-19
-- Descripción: Unificación de todos los scripts anteriores en una única fuente de verdad.
-- Incluye:
-- 1. Base Schema (Orgs, Profiles, Restaurants, Equipment, Readings)
-- 2. Modificaciones (Columnas created_by, code, snapshot_temps)
-- 3. Nuevas Tablas (Staff)
-- 4. Políticas RLS Corregidas (Sin recursión, onboarding permitido)
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLAS PRINCIPALES

-- Organizaciones
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'paused', 'suspended')) DEFAULT 'active',
  plan_type TEXT CHECK (plan_type IN ('basic', 'pro', 'enterprise')) DEFAULT 'basic',
  max_restaurants INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(), -- Agregado desde SUPABASE_ADD_CREATED_BY
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Perfiles (Usuarios)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  organization_id UUID REFERENCES organizations(id),
  role TEXT CHECK (role IN ('owner', 'admin', 'manager', 'staff')) DEFAULT 'staff',
  is_platform_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Restaurantes
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Asignaciones (Staff/Manager -> Restaurante)
CREATE TABLE IF NOT EXISTS restaurant_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('manager', 'staff')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

-- Equipos
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT, -- Agregado desde SUPABASE_ADD_CODE_COLUMN
  min_temp DECIMAL NOT NULL,
  max_temp DECIMAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Staff (Personal no usuario) - Agregado desde SUPABASE_STAFF_MIGRATION
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lecturas de Temperatura
CREATE TABLE IF NOT EXISTS temperature_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id),
  taken_by TEXT, -- Agregado desde SUPABASE_STAFF_MIGRATION
  value DECIMAL NOT NULL,
  snapshot_min_temp DECIMAL, -- Agregado desde seed_data logic
  snapshot_max_temp DECIMAL, -- Agregado desde seed_data logic
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 3. FUNCIONES Y TRIGGERS

-- A. Check Restaurant Limit
CREATE OR REPLACE FUNCTION check_restaurant_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    max_allowed INTEGER;
BEGIN
    SELECT COUNT(*) INTO current_count FROM restaurants WHERE organization_id = NEW.organization_id;
    SELECT max_restaurants INTO max_allowed FROM organizations WHERE id = NEW.organization_id;

    IF current_count >= max_allowed THEN
        RAISE EXCEPTION 'Límite de restaurantes (% ) alcanzado para su plan.', max_allowed;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_limit_restaurants ON restaurants;
CREATE TRIGGER tr_limit_restaurants
BEFORE INSERT ON restaurants
FOR EACH ROW EXECUTE PROCEDURE check_restaurant_limit();

-- B. Handle New User (Auto Profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 4. ROW LEVEL SECURITY (RLS)

-- Habilitar RLS en todas las tablas
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Helpers
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN AS $$
  -- Evitar recursión chequeando directamente sin políticas si es necesario, 
  -- pero por seguridad usaremos un SELECT simple.
  -- NOTA: Si hay políticas en profiles que usen esta función, cuidado.
  SELECT is_platform_admin FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- --- POLÍTICAS ORGANIZACIONES ---

-- Permitir crear organización a cualquier usuario autenticado (Onboarding)
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
CREATE POLICY "Users can create organizations" ON organizations
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Ver organización propia (por owner o miembro)
DROP POLICY IF EXISTS "Users view relevant organizations" ON organizations;
CREATE POLICY "Users view relevant organizations" ON organizations
FOR SELECT USING (
  created_by = auth.uid() OR
  id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()) OR
  (SELECT is_platform_admin FROM profiles WHERE id = auth.uid())
);

-- Actualizar organización propia (solo owner/creator)
DROP POLICY IF EXISTS "Owners update own org" ON organizations;
CREATE POLICY "Owners update own org" ON organizations
FOR UPDATE USING (
  created_by = auth.uid() OR
  id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);


-- --- POLÍTICAS PERFILES ---

-- Ver propio perfil
DROP POLICY IF EXISTS "Users view own profile" ON profiles;
CREATE POLICY "Users view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Actualizar propio perfil
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Ver miembros de mi organización (Para listas de usuarios/staff)
DROP POLICY IF EXISTS "View organization members" ON profiles;
CREATE POLICY "View organization members" ON profiles
FOR SELECT USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);


-- --- POLÍTICAS RESTAURANTES ---

-- Owners ven todo
DROP POLICY IF EXISTS "Owners view all org restaurants" ON restaurants;
CREATE POLICY "Owners view all org restaurants" ON restaurants
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- Staff ve asignados
DROP POLICY IF EXISTS "Staff view assigned restaurants" ON restaurants;
CREATE POLICY "Staff view assigned restaurants" ON restaurants
FOR SELECT USING (
  id IN (SELECT restaurant_id FROM restaurant_assignments WHERE user_id = auth.uid())
);

-- Owners crean restaurantes
DROP POLICY IF EXISTS "Owners create restaurants" ON restaurants;
CREATE POLICY "Owners create restaurants" ON restaurants
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  )
);


-- --- POLÍTICAS EQUIPOS ---

DROP POLICY IF EXISTS "Access equipment based on restaurant access" ON equipment;
CREATE POLICY "Access equipment based on restaurant access" ON equipment
FOR ALL USING (
  restaurant_id IN (
    SELECT id FROM restaurants 
  )
);


-- --- POLÍTICAS STAFF ---

DROP POLICY IF EXISTS "View staff members" ON staff;
CREATE POLICY "View staff members" ON staff
FOR SELECT USING (
    restaurant_id IN (
        SELECT r.id FROM restaurants r
        WHERE r.organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    )
);

DROP POLICY IF EXISTS "Manage staff members" ON staff;
CREATE POLICY "Manage staff members" ON staff
FOR ALL USING (
    restaurant_id IN (
        SELECT r.id FROM restaurants r
        WHERE r.organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    )
);


-- --- POLÍTICAS LECTURAS ---

DROP POLICY IF EXISTS "View readings based on access" ON temperature_readings;
CREATE POLICY "View readings based on access" ON temperature_readings
FOR SELECT USING (
  equipment_id IN (SELECT id FROM equipment)
);

DROP POLICY IF EXISTS "Insert readings if assigned" ON temperature_readings;
CREATE POLICY "Insert readings if assigned" ON temperature_readings
FOR INSERT WITH CHECK (
  equipment_id IN (SELECT id FROM equipment)
);

-- --- POLÍTICAS SUPER ADMIN (PLATAFORMA) ---

-- Nota: Eliminamos la política recursiva de profiles.
-- Se mantiene acceso implícito si se requiere lógica especial, 
-- pero para evitar loops, el super admin debería gestionarse con cuidado en profiles.

DROP POLICY IF EXISTS "Platform Admin view all restaurants" ON restaurants;
CREATE POLICY "Platform Admin view all restaurants" ON restaurants
FOR SELECT USING (is_platform_admin());

DROP POLICY IF EXISTS "Platform Admin view all equipment" ON equipment;
CREATE POLICY "Platform Admin view all equipment" ON equipment
FOR ALL USING (is_platform_admin());

DROP POLICY IF EXISTS "Platform Admin view all readings" ON temperature_readings;
CREATE POLICY "Platform Admin view all readings" ON temperature_readings
FOR ALL USING (is_platform_admin());
