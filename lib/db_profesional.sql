-- ESQUEMA PROFESIONAL RED VIVA v2.0

-- Roles Profesionales
DO $$ BEGIN
    CREATE TYPE profesional_rol AS ENUM (
        'Trabajador Social',
        'Psicólogo',
        'Enfermero',
        'Fisioterapeuta',
        'Gerontólogo',
        'Coordinador'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tipo de Registro de Actuación
DO $$ BEGIN
    CREATE TYPE tipo_actuacion AS ENUM (
        'ACTUACION',
        'ACLARACION',
        'CORRECCION'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Estado de Alerta/Caso
DO $$ BEGIN
    CREATE TYPE estado_workflow AS ENUM (
        'nuevo',
        'en_revision',
        'acciones_en_curso',
        'resuelta',
        'escalada',
        'cerrado'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Usuarios Profesionales
CREATE TABLE IF NOT EXISTS usuarios_profesionales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rol profesional_rol NOT NULL,
    institucion TEXT NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Casos (CAS)
CREATE TABLE IF NOT EXISTS casos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adulto_id UUID REFERENCES adultos_mayores(id) ON DELETE CASCADE,
    estado estado_workflow DEFAULT 'nuevo',
    prioridad TEXT CHECK (prioridad IN ('baja', 'media', 'alta', 'critica')),
    resumen TEXT,
    responsable_coordinador_id UUID REFERENCES usuarios_profesionales(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Alertas
CREATE TABLE IF NOT EXISTS alertas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adulto_id UUID REFERENCES adultos_mayores(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('critica', 'no conformidad', 'riesgo', 'seguimiento')),
    severidad TEXT CHECK (severidad IN ('leve', 'moderada', 'grave', 'extrema')),
    descripcion TEXT,
    origen TEXT CHECK (origen IN ('reporte_diario', 'evento_critico', 'sistema')),
    estado estado_workflow DEFAULT 'nuevo',
    asignada_a UUID REFERENCES usuarios_profesionales(id),
    recibido_at TIMESTAMPTZ DEFAULT now(),
    resuelta_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Actuaciones (Inmutables)
CREATE TABLE IF NOT EXISTS actuaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adulto_id UUID NOT NULL REFERENCES adultos_mayores(id) ON DELETE CASCADE,
    caso_id UUID REFERENCES casos(id) ON DELETE CASCADE,
    alerta_id UUID REFERENCES alertas(id) ON DELETE SET NULL,
    reporte_id UUID REFERENCES reportes_cuidador(id) ON DELETE SET NULL,
    tipo_registro tipo_actuacion NOT NULL DEFAULT 'ACTUACION',
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora TIME NOT NULL DEFAULT CURRENT_TIME,
    emitida_por_usuario_id UUID NOT NULL REFERENCES usuarios_profesionales(id),
    rol_emisor profesional_rol NOT NULL,
    institucion_emisor TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    corrige_a_actuacion_id UUID REFERENCES actuaciones(id), -- Solo para CORRECCION
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Bitácora de Auditoría
CREATE TABLE IF NOT EXISTS auditoria_profesional (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_usuario_id UUID REFERENCES usuarios_profesionales(id),
    rol_actor TEXT,
    institucion_actor TEXT,
    accion TEXT NOT NULL,
    entidad TEXT,
    entidad_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- REGLAS DE INMUTABILIDAD PARA ACTUACIONES
CREATE OR REPLACE FUNCTION protect_actuaciones() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') THEN
        RAISE EXCEPTION 'Las actuaciones en Red Viva son inmutables. No se permite edición ni borrado.';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_actuaciones ON actuaciones;
CREATE TRIGGER trg_protect_actuaciones
BEFORE UPDATE OR DELETE ON actuaciones
FOR EACH ROW EXECUTE FUNCTION protect_actuaciones();

-- RLS (Row Level Security) - Ejemplo básico
ALTER TABLE usuarios_profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE actuaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE casos ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Profesionales pueden ver todos los datos" ON usuarios_profesionales;
CREATE POLICY "Profesionales pueden ver todos los datos" ON usuarios_profesionales FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profesionales pueden ver sus actuaciones y las de su institucion" ON actuaciones;
CREATE POLICY "Profesionales pueden ver sus actuaciones y las de su institucion" ON actuaciones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profesionales pueden crear actuaciones" ON actuaciones;
CREATE POLICY "Profesionales pueden crear actuaciones" ON actuaciones FOR INSERT WITH CHECK (true);

-- Índices para trazabilidad
CREATE INDEX IF NOT EXISTS idx_actuaciones_adulto ON actuaciones(adulto_id);
CREATE INDEX IF NOT EXISTS idx_alertas_adulto ON alertas(adulto_id);
CREATE INDEX IF NOT EXISTS idx_casos_adulto ON casos(adulto_id);
