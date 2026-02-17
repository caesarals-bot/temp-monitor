-- CORRECCIÓN: Permitir crear organizaciones
-- Por defecto, RLS bloqueda los INSERT si no hay política específica.
-- Esto es necesario para el Onboarding (Crear tu primer restaurante).

CREATE POLICY "Users can create organizations" ON organizations
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Opcional: Permitir que el Owner edite su propia organización
CREATE POLICY "Owners update own org" ON organizations
FOR UPDATE USING (
  id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
);
