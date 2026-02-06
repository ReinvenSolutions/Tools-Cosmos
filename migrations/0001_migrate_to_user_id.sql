-- Migration: Cambiar de sessionId a userId en la tabla itineraries
-- Fecha: 2026-02-06
-- Descripción: Vincula los itinerarios a usuarios específicos en lugar de sesiones

-- Paso 1: Eliminar todos los datos antiguos (no podemos mapear sessionId a userId)
-- IMPORTANTE: Esto borrará todos los itinerarios existentes
TRUNCATE TABLE itineraries CASCADE;

-- Paso 2: Eliminar la columna sessionId y su constraint unique
ALTER TABLE itineraries DROP COLUMN IF EXISTS session_id;

-- Paso 3: Agregar la columna userId con foreign key a users
ALTER TABLE itineraries 
ADD COLUMN user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE;

-- Paso 4: Crear un índice para mejorar performance en queries por userId
CREATE INDEX idx_itineraries_user_id ON itineraries(user_id);

-- Paso 5: Agregar constraint unique para que cada usuario solo tenga un itinerario
ALTER TABLE itineraries ADD CONSTRAINT unique_user_itinerary UNIQUE (user_id);
