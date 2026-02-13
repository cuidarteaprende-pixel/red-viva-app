import { supabase } from './supabase';

export const ROLES_PROFESIONALES = [
    'Trabajador Social',
    'Psicólogo',
    'Enfermero',
    'Fisioterapeuta',
    'Gerontólogo',
    'Coordinador'
] as const;

export type RolProfesional = typeof ROLES_PROFESIONALES[number];

export interface UsuarioProfesional {
    id: string;
    auth_user_id: string;
    nombre: string;
    email: string;
    rol: RolProfesional;
    institucion: string;
    active: boolean;
}

export interface Actuacion {
    id: string;
    adulto_id: string;
    caso_id?: string;
    alerta_id?: string;
    reporte_id?: string;
    tipo_registro: 'ACTUACION' | 'ACLARACION' | 'CORRECCION';
    fecha: string;
    hora: string;
    emitida_por_usuario_id: string;
    rol_emisor: RolProfesional;
    institucion_emisor: string;
    descripcion: string;
    corrige_a_actuacion_id?: string;
    created_at: string;
}

export const profesionalService = {
    async getPerfil(auth_user_id: string) {
        // 1. Intentar obtener de la tabla
        const { data, error } = await supabase
            .from('usuarios_profesionales')
            .select('*')
            .eq('auth_user_id', auth_user_id)
            .maybeSingle();

        if (data) return data;

        // 2. Si no existe, intentar auto-crear desde la metadata de Auth
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id === auth_user_id) {
            const newProfile = {
                auth_user_id: user.id,
                email: user.email!,
                nombre: user.user_metadata?.nombre || 'Profesional Nuevo',
                rol: (user.user_metadata?.rol as any) || 'Coordinador',
                institucion: user.user_metadata?.institucion || 'Red Viva Demo'
            };

            const { data: inserted, error: insertError } = await supabase
                .from('usuarios_profesionales')
                .insert([newProfile])
                .select()
                .single();

            if (inserted) return inserted;
        }

        if (error) throw error;
        throw new Error("Perfil no encontrado");
    },

    async getCasos() {
        const { data, error } = await supabase
            .from('casos')
            .select(`
                *,
                adultos_mayores (nombre)
            `)
            .order('updated_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getAlertas() {
        const { data, error } = await supabase
            .from('alertas')
            .select(`
                *,
                adultos_mayores (nombre)
            `)
            .order('recibido_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async getAlertasPorRol(rol: string) {
        console.log(`[profesionalService] Consultando alertas para rol: "${rol}"`);

        const { data, error } = await supabase
            .from('alertas')
            .select(`
                *,
                adultos_mayores (nombre)
            `)
            // Aplicamos el filtro de rol. PostgREST maneja el cast a enum si el string coincide.
            .eq('rol_asignado', rol)
            .order('recibido_at', { ascending: false });

        if (error) {
            console.error(`[profesionalService] Error en getAlertasPorRol para ${rol}:`, error);
            throw error;
        }

        // Validación de robustez solicitada: asegurar que devolvemos un array
        const results = data || [];
        console.log(`[profesionalService] Alertas encontradas para ${rol}: ${results.length}`);

        return results;
    },

    async getActuaciones(adulto_id: string) {
        const { data, error } = await supabase
            .from('actuaciones')
            .select('*')
            .eq('adulto_id', adulto_id)
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },

    async crearActuacion(payload: Omit<Actuacion, 'id' | 'created_at' | 'fecha' | 'hora'>) {
        const now = new Date();
        const fecha = now.toISOString().split('T')[0];
        const hora = now.toTimeString().split(' ')[0];

        // Insert Actuación
        const { data: actuacion, error } = await supabase
            .from('actuaciones')
            .insert([{
                ...payload,
                fecha,
                hora
            }])
            .select()
            .single();

        if (error) throw error;

        // Registrar Auditoría
        await this.registrarAuditoria({
            actor_usuario_id: payload.emitida_por_usuario_id,
            rol_actor: payload.rol_emisor,
            institucion_actor: payload.institucion_emisor,
            accion: `CREAR_${payload.tipo_registro}`,
            entidad: 'actuacion',
            entidad_id: actuacion.id,
            metadata: { adulto_id: payload.adulto_id }
        });

        return actuacion;
    },

    async registrarAuditoria(log: any) {
        await supabase.from('auditoria_profesional').insert([log]);
    }
};
