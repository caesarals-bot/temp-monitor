-- Create Staff table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- 'Chef', 'Ayudante', 'Gerente', etc.
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Policies for Staff
CREATE POLICY "View staff members" ON staff
FOR SELECT USING (
    restaurant_id IN (
        SELECT r.id FROM restaurants r
        WHERE r.organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    )
);

CREATE POLICY "Manage staff members" ON staff
FOR ALL USING (
    restaurant_id IN (
        SELECT r.id FROM restaurants r
        WHERE r.organization_id IN (
            SELECT organization_id FROM profiles WHERE id = auth.uid()
        )
    )
);

-- Add 'taken_by' column to temperature_readings
ALTER TABLE temperature_readings
ADD COLUMN IF NOT EXISTS taken_by TEXT;

-- Comment on column
COMMENT ON COLUMN temperature_readings.taken_by IS 'Nombre de la persona que tomó la lectura (Usuario o Staff)';
