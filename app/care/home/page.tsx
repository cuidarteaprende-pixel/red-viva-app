"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { FileText, AlertCircle, ChevronRight, User, Calendar, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CareHomePage() {
    const [loading, setLoading] = useState(true);
    const [caregiver, setCaregiver] = useState<any>(null);
    const [adultos, setAdultos] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string>("");
    const [lastReport, setLastReport] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // Fetch caregiver profile
            const { data: cgData } = await supabase
                .from("cuidadores")
                .select("*")
                .eq("auth_user_id", session.user.id)
                .maybeSingle();

            if (cgData) {
                setCaregiver(cgData);

                // Fetch assignments
                const { data: assignments } = await supabase
                    .from("asignaciones_cuidado")
                    .select("adulto_id")
                    .eq("cuidador_id", cgData.id);

                if (assignments && assignments.length > 0) {
                    const ids = assignments.map(a => a.adulto_id);
                    const { data: amData } = await supabase
                        .from("adultos_mayores")
                        .select("id, nombre")
                        .in("id", ids);

                    if (amData) {
                        setAdultos(amData);
                        if (amData.length > 0) {
                            const prevSelected = localStorage.getItem("last_selected_adulto");
                            const initialId = prevSelected && amData.find(a => a.id === prevSelected) ? prevSelected : amData[0].id;
                            setSelectedId(initialId);
                        }
                    }
                }
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const fetchLastReport = useCallback(async () => {
        if (!selectedId) return;
        const { data } = await supabase
            .from("reportes_cuidador")
            .select("*")
            .eq("adulto_id", selectedId)
            .eq("tipo_reporte", "diario")
            .order("fecha", { ascending: false })
            .limit(1)
            .maybeSingle();
        setLastReport(data);
    }, [selectedId]);

    useEffect(() => {
        if (selectedId) {
            if (typeof window !== "undefined") {
                localStorage.setItem("last_selected_adulto", selectedId);
            }
            fetchLastReport();
        }
    }, [selectedId, fetchLastReport]);

    const selectedAdulto = adultos.find(a => a.id === selectedId);

    if (loading) return <div className="animate-pulse space-y-8">
        <div className="h-12 w-1/3 bg-muted rounded-2xl" />
        <div className="h-64 bg-muted rounded-[2.5rem]" />
        <div className="grid grid-cols-2 gap-6">
            <div className="h-48 bg-muted rounded-[2rem]" />
            <div className="h-48 bg-muted rounded-[2rem]" />
        </div>
    </div>;

    return (
        <div className="space-y-10 selection:bg-primary/20">
            {/* Welcome Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="intro-animateheader">
                    <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight">
                        Hola, <span className="text-primary italic">{caregiver?.nombre || "Cuidador"}</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium text-lg intro-animatetitle">
                        Hoy es {caregiver ? new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()) : ""}
                    </p>
                </div>

                {/* Elder Selector */}
                <div className="relative group intro-animatetitle">
                    <label className="absolute -top-2.5 left-4 px-2 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 z-10 transition-colors group-focus-within:text-primary">
                        Persona en cuidado
                    </label>
                    <div className="flex items-center gap-3 bg-white border-2 border-slate-100 rounded-2xl p-1 pr-6 focus-within:border-primary transition-all shadow-premium">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <select
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)}
                            className="bg-transparent border-none outline-none font-bold text-sm pr-4 appearance-none min-w-[140px] focus:ring-0 text-slate-900"
                        >
                            {adultos.map(a => (
                                <option key={a.id} value={a.id}>{a.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* Main Actions Grid with Human Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Urgent Action */}
                <motion.div
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                >
                    <Link
                        href="/care/report/urgent"
                        className="group relative block h-full bg-rose-500 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-rose-500/20 overflow-hidden border-4 border-rose-400/30 animate-pulse-subtle intro-animatecard-left"
                    >
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-4xl font-display font-black mb-4 tracking-tight">Acción Urgente</h2>
                            <p className="text-white/80 font-medium text-lg leading-relaxed">
                                Reporte de caída, malestar o eventos críticos que requieren aviso inmediato.
                            </p>
                            <div className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] bg-white/10 px-4 py-2 rounded-full border border-white/20">
                                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                                Alerta de Seguridad
                            </div>
                        </div>
                        {/* Human Background Image for urgency context */}
                        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 pointer-events-none transition-opacity group-hover:opacity-40">
                            <img src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=400" alt="Empathy" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-rose-500" />
                        </div>
                    </Link>
                </motion.div>

                {/* Daily Report Action */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                        href="/care/report/daily"
                        className="group relative block h-full bg-white border-2 border-slate-100 hover:border-primary/30 transition-all rounded-[3rem] p-10 shadow-premium shadow-slate-100 overflow-hidden hover-card intro-animatecard-right"
                    >
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 transition-all group-hover:bg-primary group-hover:text-white group-hover:rotate-[-6deg]">
                                <FileText className="w-8 h-8 text-primary group-hover:text-white" />
                            </div>
                            <h2 className="text-4xl font-display font-black mb-4 text-slate-900 tracking-tight">Diario 360</h2>
                            <p className="text-slate-500 font-medium text-lg leading-relaxed">
                                Evalúe el estado general, nutrición y ánimo para el seguimiento profesional.
                            </p>
                        </div>
                        {/* Human Background Image for daily care context */}
                        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20">
                            <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=400" alt="Daily Care" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white" />
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* Summary Card */}
            <section className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <h3 className="font-display font-black text-xl uppercase tracking-tight">Último Reporte Diario</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest py-1.5 px-3 bg-muted rounded-full text-muted-foreground border border-border">
                        Historial de {selectedAdulto?.nombre}
                    </span>
                </div>

                {lastReport ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SummaryStat
                            label="Fecha"
                            value={new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(new Date(lastReport.fecha + "T00:00:00"))}
                        />
                        <SummaryStat
                            label="Ánimo"
                            value={lastReport.respuestas?.emocional?.animo || "No reg."}
                            isHighlighted
                        />
                        <SummaryStat
                            label="Alimentación"
                            value={lastReport.respuestas?.polifarmacia?.estado_nutricional || "No reg."}
                        />
                        <div className="md:col-span-3 pt-6 mt-6 border-t border-border">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Observaciones</p>
                            <p className="text-sm text-foreground font-medium italic leading-relaxed">
                                "{lastReport.notas || "Sin notas adicionales."}"
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground font-medium italic">No hay reportes previos para esta persona.</p>
                    </div>
                )}
            </section>
        </div>
    );
}

function SummaryStat({ label, value, isHighlighted }: { label: string, value: string, isHighlighted?: boolean }) {
    return (
        <div className={cn(
            "p-6 rounded-3xl border border-border space-y-1",
            isHighlighted && "bg-primary/5 border-primary/10"
        )}>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className={cn(
                "text-xl font-display font-black truncate capitalize",
                isHighlighted ? "text-primary" : "text-foreground"
            )}>{value}</p>
        </div>
    );
}
