-- =============================================
-- SOLUCIÓN FINAL RLS (Ejecutar todo)
-- Unifica todos los parches anteriores en un solo script seguro.
-- =============================================

-- 1. LIMPIAR POLÍTICAS ANTERIORES (Para evitar duplicados o errores)
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Owners update own org" ON organizations;
DROP POLICY IF EXISTS "Users view own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Platform Admin view all profiles" ON profiles; -- La recursiva

-- 2. POLÍTICAS DE ORGANIZACIÓN (Critical para Onboarding)
-- Permitir INSERT a cualquier usuario autenticado (para crear su primera empresa)
CREATE POLICY "Users can create organizations" ON organizations
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permitir UPDATE a los owners de la organización
CREATE POLICY "Owners update own org" ON organizations
FOR UPDATE USING (
  id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);

-- 3. POLÍTICAS DE PERFILES (Critical para Login y Onboarding)
-- Ver tu propio perfil
CREATE POLICY "Users view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Actualizar tu propio perfil (asignar org_id, etc)
CREATE POLICY "Users update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- 4. POLÍTICAS DE RESTAURANTES (Ya deberían estar bien, pero reforzamos)
-- El trigger 'check_restaurant_limit' se encarga del conteo.
-- La política solo debe permitir al owner insertar.

DROP POLICY IF EXISTS "Owners create restaurants" ON restaurants;
CREATE POLICY "Owners create restaurants" ON restaurants
FOR INSERT WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM profiles 
    WHERE id = auth.uid() AND role IN ('owner', 'admin')
  )
);
