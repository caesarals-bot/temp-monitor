-- =============================================
-- MIGRACIÓN DE SCHEMA: Columna Code en Equipment
-- =============================================
-- El frontend espera un campo 'code' (ej. REF-01), pero no existe en DB.

ALTER TABLE equipment 
ADD COLUMN IF NOT EXISTS code TEXT;

-- Opcional: Hacerlo único por restaurante para evitar duplicados lógicos
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_code_restaurant 
-- ON equipment(restaurant_id, code);
