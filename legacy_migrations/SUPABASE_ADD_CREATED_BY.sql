-- =============================================
-- SOLUCIÓN ROBUSTA: COLUMNA CREATED_BY
-- =============================================
-- El problema es "El huevo y la gallina": Creas la org, pero RLS no te deja verla 
-- porque aún no estás en la tabla de miembros (profiles).
-- Solución: Marcar quién creó la org desde el principio.

-- 1. Agregar columna 'created_by' (si no existe)
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- 2. Limpiar políticas viejas
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Users view own active org" ON organizations;
DROP POLICY IF EXISTS "Owners update own org" ON organizations;

-- 3. NUEVAS POLÍTICAS
-- A. INSERT: Permitir si tú eres el creador (el default lo asigna solo)
CREATE POLICY "Users can create organizations" ON organizations
FOR INSERT WITH CHECK (auth.uid() = created_by);

-- B. SELECT: Ver si soy el creador O si soy miembro (vía profile)
CREATE POLICY "Users view relevant organizations" ON organizations
FOR SELECT USING (
  created_by = auth.uid() OR
  id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()) OR
  (SELECT is_platform_admin FROM profiles WHERE id = auth.uid()) -- Super Admin
);

-- C. UPDATE: Solo el creador o un owner miembro
CREATE POLICY "Owners update own org" ON organizations
FOR UPDATE USING (
  created_by = auth.uid() OR
  id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
