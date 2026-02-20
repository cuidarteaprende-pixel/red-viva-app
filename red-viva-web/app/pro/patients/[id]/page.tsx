/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    ChevronLeft,
    Activity,
    Calendar,
    Clock,
    ClipboardList,
    FileText,
    AlertTriangle,
    ArrowRight,
    TrendingUp,
    MessageCircle,
    Stethoscope
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PatientDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [paciente, setPaciente] = useState<any>(null);
    const [actuaciones, setActuaciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [pacienteRes, actuacionesRes] = await Promise.all([
                supabase.from('adultos_mayores').select('*').eq('id', id).single(),
                supabase.from('actuaciones').select('*').eq('adulto_id', id).order('created_at', { ascending: false })
            ]);

            setPaciente(pacienteRes.data);
            setActuaciones(actuacionesRes.data || []);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-10 text-center uppercase tracking-widest text-slate-400 font-black animate-pulse">Cargando Historia Digital...</div>;

    return (
        <div className="space-y-10 selection:bg-primary/10">
            {/* Navigation & Header */}
            <header className="space-y-6">
                <Link href="/pro/patients" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-all">
                    <ChevronLeft className="w-3 h-3" />
                    Volver a Pacientes
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                            <span className="text-3xl font-display font-black">{paciente?.nombre?.charAt(0)}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">{paciente?.nombre}</h1>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest">Estable</span>
                            </div>
                            <p className="text-slate-500 font-medium text-lg uppercase tracking-tighter">Expediente Centralizado: {id?.toString().slice(0, 8)}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">Exportar PDF</button>
                        <button className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Nueva Actuación</button>
                    </div>
                </div>
            </header>

            {/* Grid: Stats & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left Column: Analytics & Info */}
                <aside className="lg:col-span-4 space-y-10">
                    {/* Quick Stats Card */}
                    <section className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 space-y-8">
                        <h3 className="font-display font-black text-sm text-slate-400 uppercase tracking-widest">Signos de Alerta</h3>
                        <div className="space-y-4">
                            <VitalIndicator label="Estado Emocional" value="Optimista" trend="up" />
                            <VitalIndicator label="Nutrición" value="Baja Ingesta" trend="down" color="text-destructive" />
                            <VitalIndicator label="Sueño" value="Normal" trend="stable" />
                        </div>
                    </section>

                    {/* AI Insight Card */}
                    <section className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-display font-black mb-3 leading-none">Análisis Predictivo</h3>
                            <p className="text-white/80 text-sm font-medium leading-relaxed italic mb-6">
                                &quot;Se observa una correlación entre el rechazo alimentario de los martes y la fatiga del miércoles. Se sugiere revisar medicación matutina.&quot;
                            </p>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Generado por CareAgent IA</div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    </section>

                    {/* Quick Actions Links */}
                    <section className="space-y-2">
                        <h3 className="font-display font-black text-[10px] text-slate-400 uppercase tracking-widest ml-4 mb-4">Módulos Especializados</h3>
                        <PatientModuleLink label="Kardex de Medicación" icon={Stethoscope} />
                        <PatientModuleLink label="Bitácora de Familiares" icon={MessageCircle} />
                        <PatientModuleLink label="Consentimientos Informados" icon={FileText} />
                    </section>
                </aside>

                {/* Right Column: Timeline / History */}
                <section className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="font-display font-black text-xl text-slate-900 uppercase">Línea del Tiempo Digital</h3>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase">Filtrar por Especialidad</span>
                        </div>
                    </div>

                    <div className="relative pl-12 space-y-12 before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-1 before:bg-slate-100 before:rounded-full">
                        {actuaciones.length > 0 ? (
                            actuaciones.map((act, i) => (
                                <div key={act.id} className="relative">
                                    {/* Circle on timeline */}
                                    <div className="absolute -left-[1.85rem] top-1 w-6 h-6 rounded-full bg-white border-4 border-primary shadow-lg z-10" />

                                    <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-slate-100">
                                        <header className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                    {act.rol_emisor}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {new Date(act.created_at).toLocaleDateString()} — {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                <ChevronLeft className="w-4 h-4 rotate-180" />
                                            </div>
                                        </header>
                                        <p className="text-slate-700 text-lg font-medium leading-relaxed">
                                            {act.descripcion}
                                        </p>
                                        <footer className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registro Inmutable Red Viva</p>
                                        </footer>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Aún no hay actuaciones registradas en esta historia</p>
                            </div>
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
}

function VitalIndicator({ label, value, trend, color }: { label: string; value: string; trend: string; color?: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
                <p className={cn("text-lg font-display font-black", color || "text-slate-900")}>{value}</p>
            </div>
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                trend === 'up' ? "bg-green-100 text-green-600" : (trend === 'down' ? "bg-red-100 text-red-600" : "bg-slate-200 text-slate-400")
            )}>
                <Activity className="w-4 h-4" />
            </div>
        </div>
    );
}

function PatientModuleLink({ label, icon: Icon }: { label: string; icon: any }) {
    return (
        <button className="w-full flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl transition-all hover:bg-slate-50 hover:border-slate-200 group">
            <div className="flex items-center gap-4 text-slate-700 group-hover:text-primary transition-colors">
                <Icon className="w-5 h-5" />
                <span className="text-sm font-bold">{label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
        </button>
    );
}
