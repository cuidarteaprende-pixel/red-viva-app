/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  Activity,
  Utensils,
  Moon,
  Smile,
  Move,
  Pill,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function ReporteCuidadorContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "evento" ? "evento" : "diario";
  const [activeTab, setActiveTab] = useState<"diario" | "evento">(initialTab);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // State for Daily Report
  const [dailyForm, setDailyForm] = useState({
    estadoGeneral: "estable",
    signos: "",
    alimentacion: "normal",
    sueño: "normal",
    animo: "estable",
    movilidad: "sin_novedad",
    medicacion: "si",
    notas: ""
  });

  // State for Event Report
  const [eventForm, setEventForm] = useState({
    tipo: "caida",
    severidad: "media",
    descripcion: "",
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
  });

  const handleSendDaily = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Demo delay
      await new Promise(r => setTimeout(r, 1000));
      setSubmitted(true);
      toast.success("Reporte del día diligenciado correctamente");
    } catch (err) {
      toast.error("Error al enviar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setSubmitted(true);
      toast.success("Reporte de evento registrado correctamente");
    } catch (err) {
      toast.error("Error al registrar el evento");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-12 shadow-2xl max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">¡Muchas Gracias!</h1>
          <p className="text-slate-500 font-medium">
            El reporte ha sido registrado con trazabilidad. El equipo profesional ha sido notificado para su análisis.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 text-xs font-black uppercase tracking-widest text-slate-400">
            Registro Inmutable: {new Date().toLocaleString()}
          </div>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full btn-premium bg-primary text-white hover:bg-blue-700"
          >
            Nuevo Reporte
          </button>
          <Link href="/" className="block text-sm font-bold text-slate-400 hover:text-primary transition-colors">
            Volver al Inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-rose-100">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Caregiver background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-12">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Volver
          </Link>
          <div className="text-center md:text-right">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Portal Cuidador</h1>
            <p className="text-slate-500 font-medium flex items-center justify-center md:justify-end gap-2">
              <Clock className="w-4 h-4" /> {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </header>

        {/* Tab Switcher */}
        <div className="bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-white/50 shadow-xl mb-8 flex">
          <button
            onClick={() => setActiveTab("diario")}
            className={cn(
              "flex-1 py-4 px-6 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all",
              activeTab === "diario" ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Heart className="w-4 h-4" />
            Reporte Diario 360°
          </button>
          <button
            onClick={() => setActiveTab("evento")}
            className={cn(
              "flex-1 py-4 px-6 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all",
              activeTab === "evento" ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "text-slate-400 hover:text-rose-500"
            )}
          >
            <AlertCircle className="w-4 h-4" />
            Reporte de Evento
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "diario" ? (
            <motion.form
              key="diario"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSendDaily}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-10">

                {/* Section 1: General */}
                <Section title="Estado General" icon={<Activity className="w-5 h-5" />}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RadioOption
                      label="Estable"
                      value="estable"
                      current={dailyForm.estadoGeneral}
                      onChange={(v: string) => setDailyForm({ ...dailyForm, estadoGeneral: v })}
                      color="emerald"
                    />
                    <RadioOption
                      label="En Seguimiento"
                      value="seguimiento"
                      current={dailyForm.estadoGeneral}
                      onChange={(v: string) => setDailyForm({ ...dailyForm, estadoGeneral: v })}
                      color="blue"
                    />
                    <RadioOption
                      label="Alerta"
                      value="alerta"
                      current={dailyForm.estadoGeneral}
                      onChange={(v: string) => setDailyForm({ ...dailyForm, estadoGeneral: v })}
                      color="rose"
                    />
                  </div>
                </Section>

                {/* Section 2: Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <Section title="Alimentación" icon={<Utensils className="w-5 h-5" />}>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/10"
                      value={dailyForm.alimentacion}
                      onChange={(e) => setDailyForm({ ...dailyForm, alimentacion: e.target.value })}
                    >
                      <option value="normal">Normal / Todo</option>
                      <option value="poco">Poca ingesta</option>
                      <option value="nada">No quiso comer</option>
                    </select>
                  </Section>

                  <Section title="Sueño" icon={<Moon className="w-5 h-5" />}>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/10"
                      value={dailyForm.sueño}
                      onChange={(e) => setDailyForm({ ...dailyForm, sueño: e.target.value })}
                    >
                      <option value="normal">Descansó bien</option>
                      <option value="inquieto">Sueño inquieto</option>
                      <option value="insomnio">No durmió</option>
                    </select>
                  </Section>

                  <Section title="Estado de Ánimo" icon={<Smile className="w-5 h-5" />}>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/10"
                      value={dailyForm.animo}
                      onChange={(e) => setDailyForm({ ...dailyForm, animo: e.target.value })}
                    >
                      <option value="estable">Tranquilo / Estable</option>
                      <option value="alegre">Participativo / Alegre</option>
                      <option value="triste">Triste / Retraído</option>
                      <option value="irritable">Irritable / Agitado</option>
                    </select>
                  </Section>

                  <Section title="Movilidad" icon={<Move className="w-5 h-5" />}>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/10"
                      value={dailyForm.movilidad}
                      onChange={(e) => setDailyForm({ ...dailyForm, movilidad: e.target.value })}
                    >
                      <option value="sin_novedad">Sin novedad</option>
                      <option value="ayuda">Requirió mayor ayuda</option>
                      <option value="dolor">Con dolor al moverse</option>
                    </select>
                  </Section>
                </div>

                {/* Section 3: Medication */}
                <Section title="Medicación" icon={<Pill className="w-5 h-5" />}>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setDailyForm({ ...dailyForm, medicacion: 'si' })}
                      className={cn(
                        "flex-1 py-4 rounded-2xl font-bold transition-all",
                        dailyForm.medicacion === 'si' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-slate-50 text-slate-400"
                      )}
                    >
                      Tomada Correctamente
                    </button>
                    <button
                      type="button"
                      onClick={() => setDailyForm({ ...dailyForm, medicacion: 'no' })}
                      className={cn(
                        "flex-1 py-4 rounded-2xl font-bold transition-all",
                        dailyForm.medicacion === 'no' ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "bg-slate-50 text-slate-400"
                      )}
                    >
                      Cambios / Omitida
                    </button>
                  </div>
                </Section>

                {/* Section 4: Notes */}
                <Section title="Observaciones Libres" icon={<MessageSquare className="w-5 h-5" />}>
                  <textarea
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-6 outline-none focus:ring-2 focus:ring-primary/10 font-medium"
                    placeholder="Escribe aquí cualquier detalle relevante del día..."
                    value={dailyForm.notas}
                    onChange={(e) => setDailyForm({ ...dailyForm, notas: e.target.value })}
                  />
                </Section>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-premium bg-slate-900 text-white hover:bg-black py-5 shadow-2xl shadow-slate-900/20"
                >
                  {loading ? "Registrando..." : "Enviar Reporte 360°"}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="evento"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSendEvent}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-rose-200/20 border border-rose-50 space-y-8">
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                  <p className="text-sm text-rose-700 font-medium">
                    Use este reporte para eventos específicos que requieren aviso inmediato al equipo profesional.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Section title="Tipo de Evento" icon={<AlertCircle className="w-5 h-5" />}>
                    <select
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/10"
                      value={eventForm.tipo}
                      onChange={(e) => setEventForm({ ...eventForm, tipo: e.target.value })}
                    >
                      <option value="caida">Caída / Golpe</option>
                      <option value="dolor">Dolor Intenso</option>
                      <option value="fiebre">Fiebre / Malestar</option>
                      <option value="conducta">Cambio de Conducta</option>
                      <option value="medicamento">Error Medicamento</option>
                      <option value="otro">Otro</option>
                    </select>
                  </Section>

                  <Section title="Severidad" icon={<Activity className="w-5 h-5" />}>
                    <div className="flex gap-2">
                      {['baja', 'media', 'alta'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setEventForm({ ...eventForm, severidad: s })}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            eventForm.severidad === s
                              ? s === 'alta' ? "bg-rose-600 text-white" : s === 'media' ? "bg-amber-500 text-white" : "bg-blue-500 text-white"
                              : "bg-slate-50 text-slate-400"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </Section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Section title="Fecha" icon={<Calendar className="w-5 h-5" />}>
                    <input
                      type="date"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none"
                      value={eventForm.fecha}
                      onChange={(e) => setEventForm({ ...eventForm, fecha: e.target.value })}
                    />
                  </Section>
                  <Section title="Hora" icon={<Clock className="w-5 h-5" />}>
                    <input
                      type="time"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none"
                      value={eventForm.hora}
                      onChange={(e) => setEventForm({ ...eventForm, hora: e.target.value })}
                    />
                  </Section>
                </div>

                <Section title="Descripción del Evento" icon={<MessageSquare className="w-5 h-5" />}>
                  <textarea
                    rows={6}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-6 outline-none focus:ring-2 focus:ring-rose-500/10 font-medium"
                    placeholder="Describe exactamente qué sucedió..."
                    required
                    value={eventForm.descripcion}
                    onChange={(e) => setEventForm({ ...eventForm, descripcion: e.target.value })}
                  />
                </Section>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-premium bg-rose-600 text-white hover:bg-rose-700 py-5 shadow-2xl shadow-rose-600/20"
                >
                  {loading ? "Registrando..." : "Registrar Alerta de Evento"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function RadioOption({ label, value, current, onChange, color }: { label: string; value: string; current: string; onChange: (v: string) => void; color: string }) {
  const active = current === value;
  const colors: any = {
    emerald: active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-slate-50 text-slate-400",
    blue: active ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-400",
    rose: active ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "bg-slate-50 text-slate-400"
  };

  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={cn(
        "py-4 px-6 rounded-2xl font-bold transition-all text-sm",
        colors[color]
      )}
    >
      {label}
    </button>
  );
}

export default function ReporteCuidador() { return (<Suspense fallback={<div>Cargando...</div>}> <ReporteCuidadorContent /> </Suspense>); }
