-- ==========================================
-- 1. EXTENSIONES Y LIMPIEZA
-- ==========================================
-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. TABLAS PRINCIPALES (ORGANIZACIÓN Y USUARIOS)
-- ==========================================

-- Organizaciones (Clientes/Tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'paused', 'suspended')) DEFAULT 'active',
  plan_type TEXT CHECK (plan_type IN ('basic', 'pro', 'enterprise')) DEFAULT 'basic',
  max_restaurants INTEGER DEFAULT 1, -- Límite de sucursales según plan
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Perfiles Extendidos (Usuarios)
-- Vincula al usuario de Auth con una Organización
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  organization_id UUID REFERENCES organizations(id), -- A qué empresa pertenece
  role TEXT CHECK (role IN ('owner', 'admin', 'manager', 'staff')) DEFAULT 'staff',
  is_platform_admin BOOLEAN DEFAULT false, -- Super Admin (Dios)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 3. TABLAS DE NEGOCIO (RESTAURANTES Y EQUIPOS)
-- ==========================================

-- Restaurantes (Sedes)
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Asignaciones de Personal a Restaurantes (GRANULARIDAD)
-- Define qué usuario (Manager/Staff) puede ver qué restaurante específico.
-- Los 'owner' y 'admin' no necesitan estar aquí, ven todo por defecto.
CREATE TABLE restaurant_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('manager', 'staff')) NOT NULL, -- Rol específico en esa sede
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, restaurant_id) -- Un usuario solo puede tener un rol por sede
);

-- Equipos (Refrigeradores)
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  min_temp DECIMAL NOT NULL,
  max_temp DECIMAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lecturas de Temperatura
CREATE TABLE temperature_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id), -- Quién tomó la lectura
  value DECIMAL NOT NULL,
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 4. FUNCIONES Y TRIGGERS (LÓGICA)
-- ==========================================

-- A. Límite de Restaurantes por Plan
CREATE OR REPLACE FUNCTION check_restaurant_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    max_allowed INTEGER;
BEGIN
    -- Contar restaurantes activos de la organización
    SELECT COUNT(*) INTO current_count FROM restaurants WHERE organization_id = NEW.organization_id;
    -- Obtener límite
    SELECT max_restaurants INTO max_allowed FROM organizations WHERE id = NEW.organization_id;

    IF current_count >= max_allowed THEN
        RAISE EXCEPTION 'Límite de restaurantes (% ) alcanzado para su plan.', max_allowed;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_limit_restaurants
BEFORE INSERT ON restaurants
FOR EACH ROW EXECUTE PROCEDURE check_restaurant_limit();

-- B. Crear Perfil Automático al Registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 5. SEGURIDAD RLS (ROW LEVEL SECURITY)
-- ==========================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_readings ENABLE ROW LEVEL SECURITY;

-- --- HELPERS PARA POLÍTICAS ---
-- Función helper: ¿Soy Super Admin?
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN AS $$
  SELECT is_platform_admin FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- --- POLÍTICAS DE ORGANIZACIÓN ---

-- 1. Ver mi propia organización (si está activa)
CREATE POLICY "Users view own active org" ON organizations
FOR SELECT USING (
  id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()) OR is_platform_admin()
);


-- --- POLÍTICAS DE PERFILES ---

CREATE POLICY "Users view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- --- POLÍTICAS DE RESTAURANTES ---

-- 1. Owners/Admins ven TODOS los restaurantes de su Org
CREATE POLICY "Owners view all org restaurants" ON restaurants
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- 2. Staff/Managers ven SOLO los restaurantes asignados
CREATE POLICY "Staff view assigned restaurants" ON restaurants
FOR SELECT USING (
  id IN (SELECT restaurant_id FROM restaurant_assignments WHERE user_id = auth.uid())
);

-- 3. Crear Restaurantes: Solo Owners/Admins (el trigger valida el límite)
CREATE POLICY "Owners create restaurants" ON restaurants
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- --- POLÍTICAS DE EQUIPOS (Heredan acceso del restaurante) ---

CREATE POLICY "Access equipment based on restaurant access" ON equipment
FOR ALL USING (
  restaurant_id IN (
    SELECT id FROM restaurants -- Mis restaurantes visibles (por las políticas de arriba)
  )
);

-- --- POLÍTICAS DE LECTURAS ---

CREATE POLICY "View readings based on access" ON temperature_readings
FOR SELECT USING (
  equipment_id IN (SELECT id FROM equipment) -- Hereda visibilidad de equipos
);

CREATE POLICY "Insert readings if assigned" ON temperature_readings
FOR INSERT WITH CHECK (
  equipment_id IN (SELECT id FROM equipment) -- Debe tener acceso al equipo
);

-- --- POLÍTICAS DE ADMIN PLATAFORMA (SUPER ADMIN) ---

CREATE POLICY "Platform Admin view all restaurants" ON restaurants
FOR SELECT USING (is_platform_admin());

CREATE POLICY "Platform Admin view all profiles" ON profiles
FOR ALL USING (is_platform_admin());

CREATE POLICY "Platform Admin view all equipment" ON equipment
FOR ALL USING (is_platform_admin());

CREATE POLICY "Platform Admin view all readings" ON temperature_readings
FOR ALL USING (is_platform_admin());
