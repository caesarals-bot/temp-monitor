-- CORRECCIÓN CRÍTICA DE RLS
-- La política "Platform Admin view all profiles" estaba creando un bucle infinito (Recursión)
-- porque la función is_platform_admin() leía la tabla profiles, disparando la política de nuevo.

-- 1. Eliminar la política recursiva
DROP POLICY IF EXISTS "Platform Admin view all profiles" ON profiles;

-- 2. Asegurarse que la política básica exista (si no la creaste antes)
-- Esta es segura y suficiente para que puedas loguearte.
DROP POLICY IF EXISTS "Users view own profile" ON profiles;
CREATE POLICY "Users view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- 3. (Opcional) Política de Update para ti mismo
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);
