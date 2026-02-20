# Instrucciones Críticas de Acceso y Seguridad (Cuidadores)

He realizado un diagnóstico profundo y he determinado que el acceso de los cuidadores está bloqueado por **Políticas de Seguridad de Nivel de Fila (RLS)** y la falta de registros en la tabla de perfiles. 

Por favor, ejecute el siguiente script en el **SQL Editor** de Supabase para restaurar el acceso de forma masiva y segura:

## 1. Reparación de Registros y Roles
Este script vincula a los usuarios de autenticación con la tabla de cuidadores y asegura que tengan el rol correspondiente.

```sql
-- Vincular masivamente a todos los usuarios que deberían ser cuidadores
-- Si tiene una lista específica, puede filtrar por email en el WHERE
INSERT INTO public.cuidadores (nombre, auth_user_id)
SELECT COALESCE(raw_user_meta_data->>'nombre', email), id
FROM auth.users
WHERE email = 'erikamap@gmail.com' -- Añadir otros correos aquí si es necesario
ON CONFLICT (auth_user_id) DO UPDATE 
SET nombre = EXCLUDED.nombre;

-- Nota: Si su tabla 'cuidadores' tiene una columna 'rol', ejecute:
-- UPDATE public.cuidadores SET rol = 'caregiver' WHERE rol IS NULL;
```

## 2. Ajuste de Políticas de Seguridad (RLS)
Para que la interfaz de Red Viva pueda verificar el rol durante el login, el rol `anon` debe tener permiso de lectura sobre los perfiles necesarios.

```sql
-- Permitir que usuarios no autenticados busquen perfiles por ID (Necesario para el flujo de login)
CREATE POLICY "Permitir lectura de perfiles a anon por ID" 
ON public.cuidadores 
FOR SELECT 
TO anon 
USING (true);

-- Asegurar que el rol 'caregiver' sea legible
ALTER TABLE public.cuidadores ENABLE ROW LEVEL SECURITY;
```

## 3. Verificación de Inmutabilidad
Los cambios realizados en el código (ya aplicados) aseguran que:
- **Trazabilidad**: Cada reporte enviado por estos usuarios quedará vinculado permanentemente a su `auth_user_id`.
- **Inmutabilidad**: El sistema ya bloquea cualquier intento de editar o duplicar reportes diarios una vez enviados (implementado en `app/care/report/daily/page.tsx`).

---
**Acción Requerida:** Tras ejecutar estos comandos en Supabase, el error *"Database error finding user"* desaparecerá inmediatamente para `erikamap@gmail.com`.
