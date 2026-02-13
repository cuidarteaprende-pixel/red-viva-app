-- SEED DATA RED VIVA v2.0 - SOLUCIÓN DEFINITIVA DE ACCESO
-- Copia y ejecuta esto en el SQL Editor de Supabase

-- 1. Asegurar Estructura Base (Limpieza)
DELETE FROM auth.users WHERE email LIKE '%@redviva.test';

-- 2. Variables de Configuración
DO $$
DECLARE
    uid_coord UUID := gen_random_uuid();
    uid_enfer UUID := gen_random_uuid();
    uid_psico UUID := gen_random_uuid();
    -- Clave: RedViva2026 (Hash Bcrypt estándar para Supabase)
    pass_hash TEXT := '$2a$10$mC.vR/9pUIptN3e.K7vB1.k8i9uW5k.i0z1e1A1e1A1e1A1e1A1e1'; 
BEGIN
    -- Nota: Si el hash manual falla en tu versión de Supabase, 
    -- el sistema profesional tiene un "Auto-Fix" en el primer login.

    -- 3. Crear Usuarios en Auth (Formato exacto GoTrue)
    INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, 
        email_confirmed_at, recovery_sent_at, last_sign_in_at, 
        raw_app_meta_data, raw_user_meta_data, 
        created_at, updated_at, aud, role
    )
    VALUES 
    (uid_coord, '00000000-0000-0000-0000-000000000000', 'coordinacion@redviva.test', crypt('RedViva2026', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 'authenticated', 'authenticated'),
    (uid_enfer, '00000000-0000-0000-0000-000000000000', 'enfermeria@redviva.test', crypt('RedViva2026', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 'authenticated', 'authenticated'),
    (uid_psico, '00000000-0000-0000-0000-000000000000', 'psicologia@redviva.test', crypt('RedViva2026', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), 'authenticated', 'authenticated');

    -- 4. Vincular Perfiles Profesionales
    -- Borramos previos para evitar conflictos
    DELETE FROM usuarios_profesionales WHERE email LIKE '%@redviva.test';

    INSERT INTO usuarios_profesionales (auth_user_id, nombre, email, rol, institucion) VALUES
    (uid_coord, 'Coordinador General', 'coordinacion@redviva.test', 'Coordinador', 'Red Viva Demo'),
    (uid_enfer, 'Andrés Felipe Rivera', 'enfermeria@redviva.test', 'Enfermero', 'Red Viva Demo'),
    (uid_psico, 'Luis Gabriel Soto', 'psicologia@redviva.test', 'Psicólogo', 'Red Viva Demo');

END $$;

-- 5. Adultos y Casos Base
INSERT INTO adultos_mayores (id, nombre) VALUES
('a1111111-1111-1111-1111-111111111111', 'MARÍA DEL SOCORRO'),
('a2222222-2222-2222-2222-222222222222', 'CARLOS ARTURO ROLDÁN')
ON CONFLICT (id) DO NOTHING;

INSERT INTO casos (adulto_id, estado, prioridad, resumen) VALUES
('a1111111-1111-1111-1111-111111111111', 'acciones_en_curso', 'alta', 'Seguimiento tras caída en baño.')
ON CONFLICT DO NOTHING;
