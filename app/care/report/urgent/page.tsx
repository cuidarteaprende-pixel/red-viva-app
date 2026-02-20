"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
    AlertCircle,
    ArrowLeft,
    Camera,
    Mic,
    Send,
    Loader2,
    CheckCircle,
    Activity
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const EVENT_TYPES = [
    { id: "caida", label: "Caída / Golpe", icon: "priority_high" },
    { id: "fiebre", label: "Fiebre Alta", icon: "thermostat" },
    { id: "diarrea", label: "Diarrea / Vómito", icon: "medical_services" },
    { id: "otro", label: "Otro Suceso", icon: "help_outline" }
];

import { toast } from "sonner";

export default function UrgentReportPage() {
    const router = useRouter();
    const [caregiver, setCaregiver] = useState<any>(null);
    const [adultoId, setAdultoId] = useState<string>("");
    const [tipoEvento, setTipoEvento] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return router.push("/auth/login?role=caregiver");

            const { data: cg } = await supabase
                .from("cuidadores")
                .select("id")
                .eq("auth_user_id", session.user.id)
                .maybeSingle();

            setCaregiver(cg);
            const savedAdulto = localStorage.getItem("last_selected_adulto");
            if (savedAdulto) setAdultoId(savedAdulto);
        };
        init();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tipoEvento || !descripcion) {
            toast.error("Por favor complete todos los campos requeridos.");
            return;
        }
        setSaving(true);

        const promise = new Promise(async (resolve, reject) => {
            const payload = {
                adulto_id: adultoId,
                cuidador_id: caregiver.id,
                tipo_reporte: "evento_critico",
                tipo_evento: tipoEvento,
                descripcion_evento: descripcion,
                fecha: new Date().toISOString().split('T')[0]
            };

            try {
                const { error } = await supabase.from("reportes_cuidador").insert(payload);
                if (error) throw error;

                setSuccess(true);
                setTimeout(() => {
                    router.push("/care/home");
                    resolve(true);
                }, 2000);
            } catch (err: any) {
                reject(err);
            }
        });

        toast.promise(promise, {
            loading: 'Enviando alerta crítica...',
            success: 'Alerta enviada correctamente.',
            error: (err) => `Error: ${err.message}`,
        });

        try {
            await promise;
        } catch {
            setSaving(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-6" role="status" aria-live="polite">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20"
                >
                    <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-3xl font-display font-black text-slate-900">¡Alerta Enviada!</h2>
                <p className="text-muted-foreground font-medium text-lg">El equipo profesional ha sido notificado de inmediato.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-10 selection:bg-destructive/10">
            <header role="banner">
                <Link
                    href="/care/home"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-all mb-8 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-4 rounded-lg"
                    aria-label="Cancelar y regresar al inicio"
                >
                    <ArrowLeft className="w-3 h-3" />
                    Regresar
                </Link>
                <div className="space-y-3">
                    <div className="w-16 h-16 rounded-[2rem] bg-destructive/10 flex items-center justify-center text-destructive" aria-hidden="true">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-display font-black text-slate-900">Reporte de Urgencia</h1>
                    <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                        Use este formulario solo para situaciones que requieran atención prioritaria.
                    </p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10" id="urgent-form">
                {/* Type Selection */}
                <fieldset className="space-y-4 border-none p-0 m-0">
                    <legend className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4 mb-2">¿Qué ocurrió?</legend>
                    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-required="true">
                        {EVENT_TYPES.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTipoEvento(t.id)}
                                aria-checked={tipoEvento === t.id}
                                role="radio"
                                className={cn(
                                    "flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all text-left focus:outline-none focus:ring-4 focus:ring-destructive/20",
                                    tipoEvento === t.id
                                        ? "bg-destructive text-white border-destructive shadow-xl shadow-destructive/20"
                                        : "bg-white border-border hover:border-destructive/30"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center",
                                    tipoEvento === t.id ? "bg-white/20" : "bg-muted"
                                )} aria-hidden="true">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <span className="font-bold tracking-tight">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </fieldset>

                {/* Description */}
                <div className="space-y-4">
                    <label htmlFor="descripcion" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-4">Descripción del suceso</label>
                    <div className="relative group">
                        <textarea
                            id="descripcion"
                            required
                            rows={6}
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Describa brevemente qué pasó, a qué hora y qué hizo primero..."
                            className="w-full bg-muted/50 border-2 border-border rounded-[2.5rem] p-8 text-lg font-medium outline-none focus:border-destructive focus:ring-4 focus:ring-destructive/5 transition-all resize-none shadow-inner"
                            aria-required="true"
                        ></textarea>
                        {/* Action buttons inside textarea area */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <button disabled type="button" className="p-3 bg-white border border-border rounded-2xl text-muted-foreground opacity-50 cursor-not-allowed" title="Foto (Próximamente)" aria-hidden="true">
                                <Camera className="w-5 h-5" />
                            </button>
                            <button disabled type="button" className="p-3 bg-white border border-border rounded-2xl text-muted-foreground opacity-50 cursor-not-allowed" title="Voz (Próximamente)" aria-hidden="true">
                                <Mic className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    type="submit"
                    disabled={saving || !tipoEvento || !descripcion}
                    className="w-full bg-destructive text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-destructive/30 hover:bg-red-600 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-destructive/30"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                            Enviando Alerta...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" aria-hidden="true" />
                            Enviar Alerta Médica
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
