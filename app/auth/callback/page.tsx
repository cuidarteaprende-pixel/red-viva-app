"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            // El parámetro 'next' define a dónde ir tras el login exitoso (por defecto /care/home)
            const next = searchParams.get("next") || "/care/home";
            const code = searchParams.get("code");

            try {
                // 1. Intercambiar el código por una sesión (Flujo PKCE)
                if (code) {
                    await supabase.auth.exchangeCodeForSession(code);
                }

                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    throw new Error("No se pudo recuperar la sesión activa.");
                }

                // 2. Después del callback (con sesión activa), consultar public.cuidadores usando auth.uid()
                // Usamos auth_user_id para vincular la sesión con el perfil
                const { data: caregiver, error: cgError } = await supabase
                    .from("cuidadores")
                    .select("rol")
                    .eq("auth_user_id", session.user.id)
                    .maybeSingle();

                if (cgError) throw cgError;

                // 3. Validar rol === 'caregiver'
                // Si no existe fila o rol incorrecto: signOut() y mostrar error descriptivo
                const validRoles = ['caregiver', 'cuidador'];
                if (!caregiver || !validRoles.includes(caregiver.rol?.toLowerCase())) {
                    await supabase.auth.signOut();
                    toast.error("Tu correo no está habilitado como cuidador.");
                    // Redirigir a login con un parámetro de error para el feedback visual
                    router.push("/auth/login?role=caregiver&error=unauthorized");
                    return;
                }

                // Todo OK: Redireccionar a la interfaz del cuidador
                toast.success("¡Acceso verificado!");
                router.push(next);
            } catch (err: any) {
                console.error("Error en auth callback:", err);
                toast.error("Error de autenticación: " + (err.message || "Acceso denegado"));
                router.push("/auth/login?role=caregiver&error=callback_error");
            }
        };

        handleCallback();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F7FF] gap-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
            >
                <div className="relative mb-6">
                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                    </div>
                </div>
                <h1 className="text-2xl font-black font-display text-slate-900 tracking-tight">Verificando Acceso</h1>
                <p className="text-slate-500 font-medium">Sincronizando con Red Viva...</p>
            </motion.div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#F0F7FF]">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
