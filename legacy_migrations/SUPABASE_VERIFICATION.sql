-- =============================================
-- VERIFICACIÓN DE DATOS Y POLÍTICAS DE ACCESO
-- =============================================
-- Ejecuta estos bloques en el SQL Editor de Supabase para confirmar
-- que tus datos se están relacionando correctamente.

-- 1. VERIFICAR USUARIOS Y SUS PERFILES
-- Deberías ver el email, el rol ('owner') y si tiene organization_id asignado.
SELECT 
    p.email, 
    p.role, 
    p.organization_id, 
    o.name as organization_name,
    p.is_platform_admin
FROM profiles p
LEFT JOIN organizations o ON p.organization_id = o.id;

-- 2. VERIFICAR RESTAURANTES POR ORGANIZACIÓN
-- Confirma que cada restaurante esté ligado a la organización correcta.
SELECT 
    r.name as restaurant_name, 
    o.name as organization_name,
    r.id as restaurant_id
FROM restaurants r
JOIN organizations o ON r.organization_id = o.id;

-- 3. VALIDAR RLS (SIMULACIÓN DE ROL)
-- Supabase permite impersonar usuarios en SQL para probar políticas.
-- Reemplaza 'TU_UUID_AQUI' con el ID de un usuario (lo obtienes en la consulta 1).

-- A. Intenta leer restaurantes como ese usuario:
-- SET LOCAL ROLE authenticated;
-- SET LOCAL "request.jwt.claim.sub" = 'TU_UUID_AQUI';
-- SELECT * FROM restaurants;

-- Si el usuario es Owner de Org A, SOLAMENTE debe ver restaurantes de Org A.

-- 4. ORPHAN CHECK (Integridad de Datos)
-- Usuarios sin organización (deberían ser solo los recién registrados que aún no completan onboarding)
SELECT * FROM profiles WHERE organization_id IS NULL;

-- Restaurantes sin organización (esto sería un error grave)
SELECT * FROM restaurants WHERE organization_id IS NULL;
