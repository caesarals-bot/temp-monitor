-- =============================================
-- POLÍTICA: Ver miembros de mi organización
-- =============================================
-- Necesario para que en el Dashboard veas quién tomó una lectura,
-- o para asignar responsables si eres Manager.

CREATE POLICY "View organization members" ON profiles
FOR SELECT USING (
  organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()) OR
  auth.uid() = id -- Siempre verse a sí mismo (redundante con la otra política pero seguro)
);
