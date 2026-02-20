"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { checklistSchema } from "@/lib/checklistSchema";

type TabType = "diario" | "evento";
type Adulto = { id: string; nombre: string };

// Helpler to parse YYYY-MM-DD to a local Date object avoiding UTC shift
const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
};

// Helper for human-readable long date in Spanish
const formatLongDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(date);
};

// Helper for formatting time from ISO/TIMESTAMPTZ
const formatTime = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-CO', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(date);
};

export default function CuidadorDashboard() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Data State
    const [caregiver, setCaregiver] = useState<any>(null);
    const [adultos, setAdultos] = useState<Adulto[]>([]);
    const [selectedAdultoId, setSelectedAdultoId] = useState<string>("");
    const [lastReport, setLastReport] = useState<any>(null);

    // Form State
    const [tab, setTab] = useState<TabType>("diario");
    const [respuestas, setRespuestas] = useState<any>({});
    const [notas, setNotas] = useState("");

    // Critical Event State
    const [tipoEvento, setTipoEvento] = useState("");
    const [otroCual, setOtroCual] = useState("");
    const [descripcionEvento, setDescripcionEvento] = useState("");

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (caregiver) {
            fetchAdultos();
        }
    }, [caregiver]);

    useEffect(() => {
        if (selectedAdultoId) {
            fetchLastReport();
        }
    }, [selectedAdultoId]);

    const checkUser = async () => {
        try {
            const { data: { session }, error: authError } = await supabase.auth.getSession();
            if (authError) throw authError;
            if (!session) {
                router.push("/cuidador/login");
                return;
            }
            setSession(session);

            // Fetch caregiver record
            const { data: cgData, error: cgError } = await supabase
                .from("cuidadores")
                .select("*")
                .eq("auth_user_id", session.user.id)
                .maybeSingle();

            if (cgError) {
                console.error("Error fetching caregiver:", cgError);
                throw cgError;
            }

            if (!cgData) {
                console.warn("No caregiver profile found for auth_user_id:", session.user.id);
                // Fallback: search by email if auth_user_id link is missing
                const { data: cgEmailData } = await supabase
                    .from("cuidadores")
                    .select("*")
                    .eq("email", session.user.email)
                    .maybeSingle();

                if (cgEmailData) {
                    setCaregiver(cgEmailData);
                } else {
                    // No profile at all
                    setCaregiver(null);
                }
            } else {
                setCaregiver(cgData);
            }
        } catch (err) {
            console.error("Diagnostic error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdultos = async () => {
        if (!caregiver) {
            console.log("Cannot fetch adults: No caregiver profile loaded.");
            return;
        }

        console.log("Fetching adults for caregiver ID:", caregiver.id);

        try {
            // Get assignments
            const { data: assignments, error: assignError } = await supabase
                .from("asignaciones_cuidado")
                .select("adulto_id")
                .eq("cuidador_id", caregiver.id);

            if (assignError) throw assignError;

            if (assignments && assignments.length > 0) {
                const ids = assignments.map(a => a.adulto_id);
                const { data: amData, error: amError } = await supabase
                    .from("adultos_mayores")
                    .select("id, nombre")
                    .in("id", ids);

                if (amError) throw amError;

                if (amData) {
                    setAdultos(amData);
                    if (amData.length > 0) setSelectedAdultoId(amData[0].id);
                }
            } else {
                console.log("No assignments found in 'asignaciones_cuidado' for this caregiver.");
                setAdultos([]);
            }
        } catch (err) {
            console.error("Error in fetchAdultos:", err);
        }
    };

    const fetchLastReport = async () => {
        if (!selectedAdultoId) return;
        const { data } = await supabase
            .from("reportes_cuidador")
            .select("*")
            .eq("adulto_id", selectedAdultoId)
            .eq("tipo_reporte", "diario")
            .order("created_at", { ascending: false }) // Use created_at for true order
            .limit(1)
            .maybeSingle();

        setLastReport(data);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/cuidador/login");
    };

    const handleRespChange = (sphereId: string, questionId: string, value: any) => {
        setRespuestas((prev: any) => ({
            ...prev,
            [sphereId]: {
                ...(prev[sphereId] || {}),
                [questionId]: value
            }
        }));
    };

    const handleSaveDiario = async () => {
        if (!selectedAdultoId) return alert("Selecciona una persona en cuidado");
        setSaving(true);

        const today = new Date().toISOString().split('T')[0];

        const payload = {
            adulto_id: selectedAdultoId,
            cuidador_id: caregiver.id,
            tipo_reporte: "diario",
            fecha: today,
            respuestas: respuestas,
            notas: notas
        };

        try {
            const { error } = await supabase
                .from("reportes_cuidador")
                .upsert(payload, { onConflict: 'adulto_id,cuidador_id,fecha,tipo_reporte' });

            if (error) throw error;

            // Success UX
            setRespuestas({});
            setNotas("");
            alert("Reporte del día diligenciado correctamente ✅");

            await fetchLastReport();
            setTab("diario"); // Reset to main tab
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveEvento = async () => {
        if (!selectedAdultoId) return alert("Selecciona una persona en cuidado");
        if (!tipoEvento) return alert("Selecciona un tipo de evento");
        setSaving(true);

        const payload = {
            adulto_id: selectedAdultoId,
            cuidador_id: caregiver.id,
            tipo_reporte: "evento_critico",
            tipo_evento: tipoEvento,
            otro_cual: tipoEvento === 'otro' ? otroCual : null,
            descripcion_evento: descripcionEvento,
            fecha: new Date().toISOString().split('T')[0]
        };

        try {
            const { error } = await supabase
                .from("reportes_cuidador")
                .insert(payload);

            if (error) throw error;
            alert("Evento crítico registrado");
            setTipoEvento("");
            setOtroCual("");
            setDescripcionEvento("");
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background font-sans pb-10">
            {/* Dynamic Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/red-viva-logo.png" alt="Red Viva" className="brand-logo" />
                        <div className="h-10 w-px bg-slate-200 mx-1"></div>
                        <span className="text-2xl font-black font-outfit tracking-tighter text-slate-800 uppercase">Red Viva</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase">Cuidador Activo</p>
                            <p className="text-sm font-bold text-slate-800">{session?.user?.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Cerrar Sesión"
                        >
                            <span className="material-symbols-rounded text-xl">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6">

                {/* Diagnostic Alerts */}
                {!caregiver && (
                    <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-3xl flex items-start gap-4 animate-in fade-in duration-500">
                        <span className="material-symbols-rounded text-red-500">error</span>
                        <div>
                            <h4 className="text-sm font-bold text-red-800 uppercase tracking-tight">Perfil de Cuidador no encontrado</h4>
                            <p className="text-xs text-red-600 mt-1">
                                Tu usuario de Auth ({session?.user?.email}) no está vinculado a un registro en la tabla `cuidadores`.
                                Por favor, asegúrate de que exista un registro con `auth_user_id` igual a tu ID de Supabase.
                            </p>
                        </div>
                    </div>
                )}

                {caregiver && adultos.length === 0 && (
                    <div className="mb-6 p-6 bg-amber-50 border border-amber-200 rounded-3xl flex items-start gap-4 animate-in fade-in duration-500">
                        <span className="material-symbols-rounded text-amber-500">info</span>
                        <div>
                            <h4 className="text-sm font-bold text-amber-800 uppercase tracking-tight">Sin asignaciones registradas</h4>
                            <p className="text-xs text-amber-600 mt-1">
                                Se encontró tu perfil de cuidador (ID: {caregiver.id}), pero no tienes personas en cuidado asignadas en la tabla `asignaciones_cuidado`.
                            </p>
                        </div>
                    </div>
                )}

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Selector & Summary */}
                    <aside className="lg:col-span-4 space-y-6">

                        {/* Persona Selector */}
                        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            <label className="block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
                                Persona en cuidado asignada
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedAdultoId}
                                    onChange={(e) => setSelectedAdultoId(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 font-bold outline-none focus:border-primary transition-all appearance-none"
                                >
                                    {adultos.length === 0 && <option>No hay personas asignadas</option>}
                                    {adultos.map(a => (
                                        <option key={a.id} value={a.id}>{a.nombre}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <span className="material-symbols-rounded text-slate-400">expand_more</span>
                                </div>
                            </div>
                        </section>

                        {/* Summary Card */}
                        <section className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <span className="material-symbols-rounded text-6xl">vital_signs</span>
                            </div>
                            <h3 className="text-xl font-bold font-outfit mb-6 relative z-10">Resumen de Seguimiento</h3>

                            {lastReport ? (
                                <div className="space-y-4 relative z-10">
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Último Reporte Diario</p>
                                        <p className="text-sm font-medium">
                                            {formatLongDate(parseLocalDate(lastReport.fecha))}
                                            <span className="text-slate-500 mx-1">—</span>
                                            <span className="text-[10px] opacity-70">{formatTime(lastReport.created_at)}</span>
                                        </p>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Estado General</p>
                                        <div className="flex gap-2 flex-wrap">
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold uppercase">Funcional: {lastReport.respuestas?.funcional?.autocuidado || 'N/A'}</span>
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-bold uppercase">Ánimo: {lastReport.respuestas?.emocional?.animo || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm italic">No hay reportes previos registrados.</p>
                            )}

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-[10px] leading-relaxed text-slate-400 italic">
                                    "Acompañando con dignidad y respeto a quienes nos cuidaron."
                                </p>
                            </div>
                        </section>
                    </aside>

                    {/* RIGHT COLUMN: Forms */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Tab Navigation */}
                        <div className="flex bg-white rounded-3xl p-2 shadow-sm border border-slate-100">
                            <button
                                onClick={() => setTab("diario")}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-bold ${tab === 'diario' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <span className="material-symbols-rounded">event_note</span>
                                Reporte Diario 360°
                            </button>
                            <button
                                onClick={() => setTab("evento")}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-bold ${tab === 'evento' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <span className="material-symbols-rounded">warning</span>
                                Evento Crítico
                            </button>
                        </div>

                        {/* Main Form Content */}
                        <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                            {tab === "diario" ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-black font-outfit text-slate-800 mb-2">Checklist de Bienestar</h2>
                                        <p className="text-slate-500 text-sm">Evalúa las diferentes esferas de la persona en cuidado.</p>
                                    </div>

                                    <div className="space-y-8">
                                        {checklistSchema.spheres.map((sphere) => (
                                            <div key={sphere.id} className="border-b border-slate-100 pb-8 last:border-0">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                                                        <span className="material-symbols-rounded">{sphere.icon}</span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-800">{sphere.label}</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-12">
                                                    {sphere.questions.map((q) => (
                                                        <div key={q.id}>
                                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{q.label}</label>

                                                            {q.type === "select" ? (
                                                                <div className="grid grid-cols-1 gap-2">
                                                                    {q.options?.map((opt) => (
                                                                        <button
                                                                            key={opt.value}
                                                                            onClick={() => handleRespChange(sphere.id, q.id, opt.value)}
                                                                            className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${respuestas[sphere.id]?.[q.id] === opt.value ? 'bg-primary/5 border-primary text-primary' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}
                                                                        >
                                                                            {opt.label}
                                                                            {respuestas[sphere.id]?.[q.id] === opt.value && <span className="material-symbols-rounded text-sm">check_circle</span>}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="flex gap-4">
                                                                    <button
                                                                        onClick={() => handleRespChange(sphere.id, q.id, true)}
                                                                        className={`flex-1 p-3 rounded-xl border text-xs font-bold transition-all ${respuestas[sphere.id]?.[q.id] === true ? 'bg-green-500 border-green-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                                                                    >
                                                                        Sí, completo
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRespChange(sphere.id, q.id, false)}
                                                                        className={`flex-1 p-3 rounded-xl border text-xs font-bold transition-all ${respuestas[sphere.id]?.[q.id] === false ? 'bg-red-500 border-red-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                                                                    >
                                                                        No, incompleto
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-10 pt-10 border-t border-slate-100">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Eventos / actividades relevantes del día</label>
                                        <textarea
                                            placeholder="Ej: Recibió visita de su nieta, muy sonriente durante la tarde. Tomó más agua de lo habitual..."
                                            rows={4}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-slate-700 outline-none focus:border-primary transition-all mb-8 resize-none"
                                            value={notas}
                                            onChange={(e) => setNotas(e.target.value)}
                                        />

                                        <button
                                            onClick={handleSaveDiario}
                                            disabled={saving}
                                            className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <span className="material-symbols-rounded">save</span>
                                            {saving ? "Guardando..." : "Guardar Reporte Diario"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-black font-outfit text-red-600 mb-2">Registro de Evento Crítico</h2>
                                        <p className="text-slate-500 text-sm">Informa inmediatamente cualquier situación de riesgo o cambio brusco.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tipo de Evento</label>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {["caida", "fiebre", "diarrea", "vomito", "otro"].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setTipoEvento(t)}
                                                        className={`p-4 rounded-2xl border text-sm font-bold uppercase tracking-tight transition-all ${tipoEvento === t ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-red-200'}`}
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {tipoEvento === 'otro' && (
                                            <div className="animate-in zoom-in-95 duration-200">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">¿Cuál evento?</label>
                                                <input
                                                    type="text"
                                                    placeholder="Especifique el tipo de evento..."
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-700 outline-none focus:border-red-400 transition-all"
                                                    value={otroCual}
                                                    onChange={(e) => setOtroCual(e.target.value)}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Descripción del Suceso</label>
                                            <textarea
                                                placeholder="Detalle exactamente lo ocurrido, hora y respuesta inicial tomada..."
                                                rows={6}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-slate-700 outline-none focus:border-red-400 transition-all mb-8 resize-none"
                                                value={descripcionEvento}
                                                onChange={(e) => setDescripcionEvento(e.target.value)}
                                            />
                                        </div>

                                        <button
                                            onClick={handleSaveEvento}
                                            disabled={saving}
                                            className="w-full bg-red-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all transform active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <span className="material-symbols-rounded">priority_high</span>
                                            {saving ? "Enviando..." : "Enviar Evento de Alerta"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Ethics Disclosure */}
                        <div className="p-8 bg-slate-100 rounded-[2rem] border border-slate-200 flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shrink-0 shadow-sm">
                                <span className="material-symbols-rounded">gavel</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">Compromiso Ético Red Viva</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    La información registrada es vital para el equipo interdisciplinario. Recuerda que los registros son <span className="text-slate-800 font-bold">inmutables</span> y forman parte de la bitácora profesional. Actúa con transparencia y cuidado humano.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
