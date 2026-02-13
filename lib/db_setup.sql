-- TABLAS NECESARIAS PARA RED VIVA (Cuidador Dashboard)

-- 1. Tabla de Adultos Mayores
CREATE TABLE IF NOT EXISTS adultos_mayores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de Cuidadores (Relacionada con Supabase Auth)
CREATE TABLE IF NOT EXISTS cuidadores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabla de Asignaciones (N a N)
CREATE TABLE IF NOT EXISTS asignaciones_cuidado (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adulto_id UUID REFERENCES adultos_mayores(id) ON DELETE CASCADE,
    cuidador_id UUID REFERENCES cuidadores(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(adulto_id, cuidador_id)
);

-- 4. Tabla de Reportes del Cuidador (DIARIO y EVENTO CRÍTICO)
-- Si la tabla ya existe, asegúrate de correr los ALTER TABLE
CREATE TABLE IF NOT EXISTS reportes_cuidador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_reporte TEXT NOT NULL CHECK (tipo_reporte IN ('diario', 'evento_critico')),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    adulto_id UUID REFERENCES adultos_mayores(id) ON DELETE CASCADE,
    cuidador_id UUID REFERENCES cuidadores(id) ON DELETE CASCADE,
    
    -- Columnas para Reporte Diario
    respuestas JSONB, -- Estructura 360° definida en checklistSchema.ts
    notas TEXT, -- Comentarios libres
    
    -- Columnas para Evento Crítico
    tipo_evento TEXT CHECK (tipo_evento IN ('caida', 'fiebre', 'diarrea', 'vomito', 'otro')),
    otro_cual TEXT,
    descripcion_evento TEXT,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para evitar duplicidad de reportes diarios (UPSERT funcional)
CREATE UNIQUE INDEX IF NOT EXISTS unique_daily_report 
ON reportes_cuidador (adulto_id, cuidador_id, fecha, tipo_reporte) 
WHERE tipo_reporte = 'diario';

-- EJEMPLO DE REGISTRO EN respuestas (jsonb):
-- {
--   "funcional": { "autocuidado": "ok", "riesgo_caidas": "medio" },
--   "mental": { "memoria": "olvidos_leves" },
--   "emocional": { "animo": "stable" },
--   "social": { "red_apoyo": "moderada" },
--   "sensorial": { "vision": "limitada" },
--   "polifarmacia": { "toma_completa": true }
-- }
