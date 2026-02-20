"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
    Save,
    Mic,
    AlertCircle,
    ChevronRight,
    CheckCircle2,
    Calendar,
    Clock,
    User,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Components
import WizardShell from "@/components/report/WizardShell";
import YesNoChips from "@/components/report/YesNoChips";
import QuickScaleEmoji from "@/components/report/QuickScaleEmoji";
import OptionSelect from "@/components/report/OptionSelect";
import TextareaNote from "@/components/report/TextareaNote";

export default function Daily360WizardPage() {
    const router = useRouter();

    // -- State --
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [caregiver, setCaregiver] = useState<any>(null);
    const [adultos, setAdultos] = useState<any[]>([]);

    // Meta Data
    const [adultoId, setAdultoId] = useState<string>("");
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
    const [hora, setHora] = useState(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false }));
    const [turno, setTurno] = useState<string>("Mañana");

    // Responses State (8 steps)
    const [respuestas, setRespuestas] = useState<any>({
        paso1: {},
        paso2: {},
        paso3: {},
        paso4: {},
        paso5: {},
        paso6: {},
        paso7: {},
        paso8: {},
    });
    const [observacionesLibres, setObservacionesLibres] = useState("");

    // -- Persistence (Autosave every 10s) --
    useEffect(() => {
        const interval = setInterval(() => {
            if (step > 0 || Object.keys(respuestas.paso1).length > 0) {
                const draft = {
                    respuestas,
                    observacionesLibres,
                    adultoId,
                    fecha,
                    hora,
                    turno,
                    step
                };
                localStorage.setItem("daily_report_draft", JSON.stringify(draft));
                // We don't toast on autosave to avoid noise, but maybe a small indicator?
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [respuestas, observacionesLibres, adultoId, fecha, hora, turno, step]);

    // -- Initial Load --
    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/auth/login?role=caregiver");
                return;
            }

            // Get Caregiver
            const { data: cg } = await supabase
                .from("cuidadores")
                .select("*")
                .eq("auth_user_id", session.user.id)
                .maybeSingle();

            if (!cg) {
                toast.error("No se encontró perfil de cuidador.");
                router.push("/gateway");
                return;
            }
            setCaregiver(cg);

            // Get Assigned Adults
            const { data: assignments } = await supabase
                .from("asignaciones_cuidado")
                .select("adulto_id")
                .eq("cuidador_id", cg.id);

            if (assignments && assignments.length > 0) {
                const ids = assignments.map(a => a.adulto_id);
                const { data: amData } = await supabase
                    .from("adultos_mayores")
                    .select("id, nombre")
                    .in("id", ids);

                if (amData) {
                    setAdultos(amData);
                    const savedAdulto = localStorage.getItem("last_selected_adulto");
                    if (savedAdulto && amData.find(a => a.id === savedAdulto)) {
                        setAdultoId(savedAdulto);
                    } else {
                        setAdultoId(amData[0].id);
                    }
                }
            }

            // Load Draft
            const draftRaw = localStorage.getItem("daily_report_draft");
            if (draftRaw) {
                try {
                    const draft = JSON.parse(draftRaw);
                    // Only load if it's recent (same day)
                    if (draft.fecha === new Date().toISOString().split("T")[0]) {
                        setRespuestas(draft.respuestas);
                        setObservacionesLibres(draft.observacionesLibres);
                        setStep(draft.step || 0);
                        if (draft.adultoId) setAdultoId(draft.adultoId);
                        setTurno(draft.turno || "Mañana");
                    }
                } catch (e) {
                    console.error("Error loading draft", e);
                }
            }

            setLoading(false);
        };
        init();
    }, [router]);

    // -- Helpers --
    const updateResp = (paso: string, key: string, value: any) => {
        setRespuestas((prev: any) => ({
            ...prev,
            [paso]: {
                ...prev[paso],
                [key]: value
            }
        }));
    };

    const handleSaveDraft = () => {
        const draft = { respuestas, observacionesLibres, adultoId, fecha, hora, turno, step };
        localStorage.setItem("daily_report_draft", JSON.stringify(draft));
        toast.success("Borrador guardado localmente.");
    };

    const handleSubmit = async () => {
        if (!adultoId) {
            toast.error("Por favor selecciona a la persona en cuidado.");
            setStep(0);
            return;
        }

        setSaving(true);

        const payload = {
            adulto_id: adultoId,
            cuidador_id: caregiver.id,
            tipo_reporte: "diario",
            fecha: fecha,
            respuestas: {
                ...respuestas,
                meta: {
                    hora,
                    turno
                }
            },
            notas: observacionesLibres,
            nota_voz_url: "" // Placeholder
        };

        try {
            const { error } = await supabase
                .from("reportes_cuidador")
                .insert(payload);

            if (error) throw error;

            // Clear draft
            localStorage.removeItem("daily_report_draft");

            toast.success("¡Reporte enviado con éxito!");
            router.push("/care/report/daily/success");
        } catch (err: any) {
            toast.error(`Error al enviar: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Cargando Wizard 360...</p>
            </div>
        </div>
    );

    // -- Content Logic --
    const renderStep = () => {
        switch (step) {
            case 0: return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">¿A quién cuidas hoy?</label>
                            <div className="flex items-center gap-4 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4">
                                <User className="w-5 h-5 text-slate-400" />
                                <select
                                    value={adultoId}
                                    onChange={(e) => setAdultoId(e.target.value)}
                                    className="bg-transparent border-none outline-none font-bold text-slate-900 w-full"
                                >
                                    {adultos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Fecha</label>
                                <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="bg-transparent border-none outline-none font-bold text-sm w-full" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Hora</label>
                                <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="bg-transparent border-none outline-none font-bold text-sm w-full" />
                                </div>
                            </div>
                        </div>

                        <OptionSelect
                            label="Turno de trabajo"
                            value={turno}
                            onChange={setTurno}
                            options={[
                                { label: "Mañana", value: "Mañana" },
                                { label: "Tarde", value: "Tarde" },
                                { label: "Noche", value: "Noche" }
                            ]}
                            columns={3}
                        />
                    </div>
                </div>
            );

            case 1: return (
                <div className="space-y-8">
                    <QuickScaleEmoji
                        label="Nivel de Dolor"
                        value={respuestas.paso1.dolor}
                        onChange={(v) => updateResp("paso1", "dolor", v)}
                        options={[
                            { label: "Sin Dolor", value: "Nada", emoji: "😊" },
                            { label: "Leve", value: "Leve", emoji: "🙂" },
                            { label: "Moderado", value: "Moderado", emoji: "😐" },
                            { label: "Fuerte", value: "Fuerte", emoji: "😟" }
                        ]}
                    />
                    <YesNoChips label="¿Tiene fiebre o sensación de fiebre?" value={respuestas.paso1.fiebre} onChange={(v) => updateResp("paso1", "fiebre", v)} />
                    <OptionSelect
                        label="Respiración"
                        value={respuestas.paso1.respiracion}
                        onChange={(v) => updateResp("paso1", "respiracion", v)}
                        options={[
                            { label: "Normal", value: "Normal" },
                            { label: "Agitada", value: "Agitada" },
                            { label: "Tos fuerte", value: "Tos fuerte" }
                        ]}
                    />
                    <QuickScaleEmoji
                        label="Nivel de Energía"
                        value={respuestas.paso1.energia}
                        onChange={(v) => updateResp("paso1", "energia", v)}
                        options={[
                            { label: "Baja", value: "Baja", emoji: "😴" },
                            { label: "Media", value: "Media", emoji: "🙂" },
                            { label: "Alta", value: "Alta", emoji: "😃" }
                        ]}
                    />
                    <TextareaNote value={respuestas.paso1.nota || ""} onChange={(v) => updateResp("paso1", "nota", v)} />
                </div>
            );

            case 2: return (
                <div className="space-y-8">
                    <OptionSelect
                        label="¿Caminó hoy?"
                        value={respuestas.paso2.camino}
                        onChange={(v) => updateResp("paso2", "camino", v)}
                        options={[
                            { label: "Sí, sin ayuda", value: "Sí sin ayuda" },
                            { label: "Con ayuda", value: "Con ayuda" },
                            { label: "No caminó", value: "No" }
                        ]}
                    />
                    <QuickScaleEmoji
                        label="Equilibrio"
                        value={respuestas.paso2.equilibrio}
                        onChange={(v) => updateResp("paso2", "equilibrio", v)}
                        options={[
                            { label: "Bien", value: "Bien", emoji: "🟢" },
                            { label: "Inestable", value: "Inestable", emoji: "🟡" },
                            { label: "Muy inestable", value: "Muy inestable", emoji: "🔴" }
                        ]}
                    />
                    <div className="space-y-4">
                        <OptionSelect
                            label="¿Hubo caída o casi caída?"
                            value={respuestas.paso2.caida}
                            onChange={(v) => updateResp("paso2", "caida", v)}
                            options={[
                                { label: "No", value: "No" },
                                { label: "Casi cae", value: "Casi cae" },
                                { label: "SÍ CAYÓ", value: "Sí cayó" }
                            ]}
                        />
                        {respuestas.paso2.caida === "Sí cayó" && (
                            <Link
                                href="/care/report/urgent"
                                className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 font-bold animate-pulse"
                            >
                                <AlertCircle className="w-5 h-5" />
                                ATENCIÓN: Por favor usa el Reporte de Urgencia
                                <ArrowRight className="w-4 h-4 ml-auto" />
                            </Link>
                        )}
                    </div>
                </div>
            );

            case 3: return (
                <div className="space-y-8">
                    <OptionSelect
                        label="Alimentación"
                        value={respuestas.paso3.comio}
                        onChange={(v) => updateResp("paso3", "comio", v)}
                        options={[
                            { label: "Comió Bien", value: "Bien" },
                            { label: "Comió Poco", value: "Poco" },
                            { label: "No comió nada", value: "Nada" }
                        ]}
                    />
                    <OptionSelect
                        label="Hidratación (Líquidos)"
                        value={respuestas.paso3.liquidos}
                        onChange={(v) => updateResp("paso3", "liquidos", v)}
                        options={[
                            { label: "Tomó Bien", value: "Bien" },
                            { label: "Tomó Poco", value: "Poco" },
                            { label: "No tomó nada", value: "Nada" }
                        ]}
                    />
                    <YesNoChips label="¿Tuvo náuseas o vómito?" value={respuestas.paso3.nauseas} onChange={(v) => updateResp("paso3", "nauseas", v)} />
                    <OptionSelect
                        label="Evacuación (Baño)"
                        value={respuestas.paso3.evacuacion}
                        onChange={(v) => updateResp("paso3", "evacuacion", v)}
                        options={[
                            { label: "Normal", value: "Normal" },
                            { label: "Estreñimiento", value: "Estreñimiento" },
                            { label: "Diarrea", value: "Diarrea" },
                            { label: "No hizo", value: "No hizo" }
                        ]}
                    />
                    <TextareaNote value={respuestas.paso3.nota || ""} onChange={(v) => updateResp("paso3", "nota", v)} />
                </div>
            );

            case 4: return (
                <div className="space-y-8">
                    <OptionSelect
                        label="¿Tomó medicamentos como se indicó?"
                        value={respuestas.paso4.toma}
                        onChange={(v) => updateResp("paso4", "toma", v)}
                        options={[
                            { label: "Sí, todos", value: "Sí" },
                            { label: "Parcialmente", value: "Parcial" },
                            { label: "No tomó ninguno", value: "No" }
                        ]}
                    />
                    <YesNoChips label="¿Se olvidó alguna dosis?" value={respuestas.paso4.olvido} onChange={(v) => updateResp("paso4", "olvido", v)} />
                    <OptionSelect
                        label="¿Notó efectos secundarios?"
                        value={respuestas.paso4.efectos}
                        onChange={(v) => updateResp("paso4", "efectos", v)}
                        options={[
                            { label: "Ninguno", value: "No" },
                            { label: "Sueño excesivo", value: "Sueño excesivo" },
                            { label: "Mareo", value: "Mareo" },
                            { label: "Dolor estómago", value: "Dolor estómago" }
                        ]}
                    />
                    <TextareaNote label="Detalle de medicamentos y horas" placeholder="Ej: Losartan 8am, Enalapril 2pm..." value={respuestas.paso4.nota || ""} onChange={(v) => updateResp("paso4", "nota", v)} />
                </div>
            );

            case 5: return (
                <div className="space-y-8">
                    <OptionSelect
                        label="Higiene Personal"
                        value={respuestas.paso5.higiene}
                        onChange={(v) => updateResp("paso5", "higiene", v)}
                        options={[
                            { label: "Completa", value: "Completa" },
                            { label: "Parcial", value: "Parcial" },
                            { label: "No se pudo", value: "No se pudo" }
                        ]}
                    />
                    <QuickScaleEmoji
                        label="Estado de la Piel"
                        value={respuestas.paso5.piel}
                        onChange={(v) => updateResp("paso5", "piel", v)}
                        options={[
                            { label: "Bien", value: "Bien", emoji: "🟢" },
                            { label: "Enrojecida", value: "Enrojecida", emoji: "🟡" },
                            { label: "Herida / Llaga", value: "Herida o llaga", emoji: "🔴" }
                        ]}
                    />
                    <OptionSelect
                        label="Incontinencia"
                        value={respuestas.paso5.incontinencia}
                        onChange={(v) => updateResp("paso5", "incontinencia", v)}
                        options={[
                            { label: "No tuvo", value: "No" },
                            { label: "Solo Orina", value: "Orina" },
                            { label: "Solo Heces", value: "Heces" },
                            { label: "Ambas", value: "Ambas" }
                        ]}
                    />
                    <YesNoChips label="¿Tiene úlceras o lesiones?" value={respuestas.paso5.ulceras} onChange={(v) => updateResp("paso5", "ulceras", v)} />
                    <TextareaNote value={respuestas.paso5.nota || ""} onChange={(v) => updateResp("paso5", "nota", v)} />
                </div>
            );

            case 6: return (
                <div className="space-y-8">
                    <QuickScaleEmoji
                        label="Calidad del Sueño"
                        value={respuestas.paso6.sueño}
                        onChange={(v) => updateResp("paso6", "sueño", v)}
                        options={[
                            { label: "Durmió Mal", value: "Mal", emoji: "😴" },
                            { label: "Regular", value: "Regular", emoji: "🙂" },
                            { label: "Durmió Bien", value: "Bien", emoji: "😃" }
                        ]}
                    />
                    <YesNoChips label="¿Se despertó muchas veces?" value={respuestas.paso6.desperto} onChange={(v) => updateResp("paso6", "desperto", v)} />
                    <YesNoChips label="¿Tuvo agitación nocturna?" value={respuestas.paso6.agitacion} onChange={(v) => updateResp("paso6", "agitacion", v)} />
                    <OptionSelect
                        label="Siestas en el día"
                        value={respuestas.paso6.siestas}
                        onChange={(v) => updateResp("paso6", "siestas", v)}
                        options={[
                            { label: "No tuvo", value: "No" },
                            { label: "Siesta Corta", value: "Corta" },
                            { label: "Siesta Larga", value: "Larga" }
                        ]}
                    />
                    <TextareaNote value={respuestas.paso6.nota || ""} onChange={(v) => updateResp("paso6", "nota", v)} />
                </div>
            );

            case 7: return (
                <div className="space-y-8">
                    <OptionSelect
                        label="Orientación (¿Sabe quién es/dónde está?)"
                        value={respuestas.paso7.orientacion}
                        onChange={(v) => updateResp("paso7", "orientacion", v)}
                        options={[
                            { label: "Sí, orientado", value: "Sí" },
                            { label: "A veces duda", value: "A veces" },
                            { label: "No orientado", value: "No" }
                        ]}
                    />
                    <div className="space-y-4">
                        <YesNoChips label="¿Notó confusión o delirios?" value={respuestas.paso7.confusion} onChange={(v) => updateResp("paso7", "confusion", v)} />
                        {respuestas.paso7.confusion === true && (
                            <Link
                                href="/care/report/urgent"
                                className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 font-bold"
                            >
                                <AlertCircle className="w-5 h-5" />
                                Recomendado: Reportar urgencia ahora
                                <ArrowRight className="w-4 h-4 ml-auto" />
                            </Link>
                        )}
                    </div>
                    <QuickScaleEmoji
                        label="Estado de Ánimo"
                        value={respuestas.paso7.animo}
                        onChange={(v) => updateResp("paso7", "animo", v)}
                        options={[
                            { label: "Bajo", value: "Bajo", emoji: "😟" },
                            { label: "Neutro", value: "Neutro", emoji: "😐" },
                            { label: "Bueno", value: "Bueno", emoji: "🙂" }
                        ]}
                    />
                    <QuickScaleEmoji
                        label="Nivel de Ansiedad"
                        value={respuestas.paso7.ansiedad}
                        onChange={(v) => updateResp("paso7", "ansiedad", v)}
                        options={[
                            { label: "Baja", value: 1, emoji: "😌" },
                            { label: "Normal", value: 3, emoji: "😐" },
                            { label: "Alta", value: 5, emoji: "😰" }
                        ]}
                    />
                    <TextareaNote value={respuestas.paso7.nota || ""} onChange={(v) => updateResp("paso7", "nota", v)} />
                </div>
            );

            case 8: return (
                <div className="space-y-8">
                    <OptionSelect
                        label="¿Cómo te sientes tú (cuidador) hoy?"
                        value={respuestas.paso8.cuidador_sentir}
                        onChange={(v) => updateResp("paso8", "cuidador_sentir", v)}
                        options={[
                            { label: "Muy cansado", value: "Muy cansado" },
                            { label: "Normal", value: "Normal" },
                            { label: "Bien / Con energía", value: "Bien" }
                        ]}
                    />
                    <TextareaNote
                        label="OBSERVACIONES LIBRES DEL DÍA"
                        placeholder="Cuéntanos con tus palabras qué pasó hoy, anécdotas o detalles importantes..."
                        value={observacionesLibres}
                        onChange={setObservacionesLibres}
                        rows={6}
                    />

                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Nota de voz</p>
                        <button
                            disabled
                            className="w-full py-6 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors"
                        >
                            <Mic className="w-6 h-6" />
                            <span className="text-xs font-bold uppercase tracking-widest">Grabar nota de voz (Próximamente)</span>
                        </button>
                    </div>

                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                        <h4 className="flex items-center gap-2 text-primary font-bold mb-2">
                            <CheckCircle2 className="w-5 h-5" />
                            Listo para enviar
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Al finalizar, su reporte se guardará de forma inmutable para el seguimiento del equipo médico.
                        </p>
                    </div>
                </div>
            );

            default: return null;
        }
    };

    const STEP_TITLES = [
        "Configuración Inicial",
        "Salud y Energía",
        "Movilidad y Riesgos",
        "Nutrición y Baño",
        "Medicación",
        "Higiene y Piel",
        "Sueño y Descanso",
        "Cognición y Emoción",
        "Entorno y Tú"
    ];

    const STEP_DESCS = [
        "Confirma para quién es el reporte y el momento del día.",
        "Signos vitales básicos y sensación general de bienestar.",
        "Actividad física y prevención de accidentes.",
        "Calidad de la ingesta y regularidad intestinal.",
        "Seguimiento de la pauta farmacológica del día.",
        "Cuidado corporal y detección temprana de lesiones.",
        "Calidad del reposo y comportamientos nocturnos.",
        "Estado mental, memoria y ánimo de la persona.",
        "Cierre del día y tu estado como cuidador."
    ];

    return (
        <WizardShell
            currentStep={step}
            totalSteps={9} // 0 to 8 = 9 steps total
            title={STEP_TITLES[step]}
            description={STEP_DESCS[step]}
            canBack={step > 0}
            onBack={() => setStep(step - 1)}
            onSaveDraft={handleSaveDraft}
        >
            {renderStep()}

            {/* Navigation Buttons (Floating at bottom of children) */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
                <div className="max-w-xl mx-auto flex justify-end pointer-events-auto">
                    {step < 8 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="w-full sm:w-auto bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 px-12 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                        >
                            Siguiente
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="w-full sm:w-auto bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 px-12 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {saving ? "Enviando..." : "Finalizar y Enviar"}
                            <Save className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </WizardShell>
    );
}
