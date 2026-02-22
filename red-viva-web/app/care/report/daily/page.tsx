"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

type StepKey =
  | "salud_fisica"
  | "movilidad"
  | "nutricion"
  | "medicacion"
  | "higiene_piel"
  | "sueno"
  | "cognicion_emocional"
  | "entorno_cuidador";

type StepData = Record<string, unknown>;
type Respuestas = Record<StepKey, StepData>;

type StepGroup = {
  title: string;
  subtitle: string;
  keys: StepKey[];
};

type FormData = {
  fechaHora: string;
  respuestas: Respuestas;
  notaCorta: string;
  observaciones: string;
};

type DbAdulto = { id: string; nombre: string | null };

function nowIsoLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function ensureRespuestas(): Respuestas {
  return {
    salud_fisica: {},
    movilidad: {},
    nutricion: {},
    medicacion: {},
    higiene_piel: {},
    sueno: {},
    cognicion_emocional: {},
    entorno_cuidador: {},
  };
}

const SCALE_1_5 = [
  "1 — Nada",
  "2 — Leve",
  "3 — Moderado",
  "4 — Alto",
  "5 — Muy alto",
];

const BG_IMG =
  "https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg?auto=compress&cs=tinysrgb&w=1920";

export default function DailyReportPage() {
  const router = useRouter();

  const stepGroups: StepGroup[] = useMemo(
    () => [
      {
        title: "Chequeo físico",
        subtitle: "Salud, movilidad y nutrición",
        keys: ["salud_fisica", "movilidad", "nutricion"],
      },
      {
        title: "Rutina y cuidado",
        subtitle: "Medicación, higiene/piel y sueño",
        keys: ["medicacion", "higiene_piel", "sueno"],
      },
      {
        title: "Cognición y entorno",
        subtitle: "Emoción, entorno y cierre",
        keys: ["cognicion_emocional", "entorno_cuidador"],
      },
    ],
    []
  );

  const [groupIndex, setGroupIndex] = useState(0);
  const isLastGroup = groupIndex === stepGroups.length - 1;
  const currentGroup = stepGroups[groupIndex];

  const [adultoId, setAdultoId] = useState<string | null>(null);
  const [adultoNombre, setAdultoNombre] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fechaHora: nowIsoLocal(),
    respuestas: ensureRespuestas(),
    notaCorta: "",
    observaciones: "",
  });

  const updateStepData = (stepKey: StepKey, field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      respuestas: {
        ...prev.respuestas,
        [stepKey]: {
          ...(prev.respuestas[stepKey] ?? {}),
          [field]: value,
        },
      },
    }));
  };

  // Cargar adulto: primer registro (demo estable)
  useEffect(() => {
    async function loadAdulto() {
      try {
        const { data: am, error } = await supabase
          .from("adultos_mayores")
          .select("id,nombre")
          .order("id", { ascending: true })
          .limit(1)
          .maybeSingle<DbAdulto>();

        if (error) {
          toast.error("No pude cargar adulto mayor", { description: error.message });
          return;
        }

        if (am?.id) {
          setAdultoId(am.id);
          setAdultoNombre(am.nombre ?? "");
        } else {
          toast.error("No hay adultos mayores", {
            description: "Crea al menos 1 registro en adultos_mayores.",
          });
        }
      } finally {
        setLoading(false);
      }
    }

    loadAdulto();
  }, []);

  const handlePrev = () => {
    setGroupIndex((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = async () => {
    if (groupIndex < stepGroups.length - 1) {
      setGroupIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    await handleSubmit();
  };

  async function insertReporteDiario() {
    if (!adultoId) throw new Error("adultoId null");

    const contenido: Record<string, unknown> = {
      respuestas: formData.respuestas,
      notaCorta: formData.notaCorta || "—",
      observaciones: formData.observaciones || "—",
      fechaHoraLocal: formData.fechaHora,
    };

    const payload: Record<string, unknown> = {
      adulto_id: adultoId,
      tipo_reporte: "diario",
      contenido,
      cuidador_nombre: DEMO_MODE ? "Cuidador Demo" : "Cuidador",
    };

    const { error } = await supabase.from("reportes_cuidador").insert(payload);
    if (error) throw new Error(error.message);
  }

  const handleSubmit = async () => {
    if (!adultoId) {
      toast.error("No se puede guardar el reporte", { description: "Falta identificar el adulto." });
      return;
    }

    setSaving(true);
    try {
      await insertReporteDiario();
      toast.success("Reporte guardado", { description: "Redirigiendo…" });
      router.push(`/care/report/daily/success?adulto=${encodeURIComponent(adultoNombre || "")}`);
    } catch (e) {
      toast.error("No se pudo guardar", { description: String(e) });
    } finally {
      setSaving(false);
    }
  };

  const renderFields = (k: StepKey) => {
    const step = formData.respuestas[k];
    const getVal = (field: string) => step?.[field];
    const set = (field: string, value: unknown) => updateStepData(k, field, value);

    switch (k) {
      case "salud_fisica":
        return (
          <SectionCard title="Salud física y signos" subtitle="Dolor, fiebre, respiración, energía">
            <Select
              label="Dolor"
              value={(getVal("dolor") as string | undefined) ?? ""}
              onChange={(val) => set("dolor", val)}
              options={["Nada", "Leve", "Moderado", "Fuerte", "10/10"]}
            />
            <YesNo
              label="¿Fiebre o sensación de fiebre?"
              value={(getVal("fiebre") as boolean | null | undefined) ?? null}
              onChange={(val) => set("fiebre", val)}
            />
            <Select
              label="Respiración"
              value={(getVal("respiracion") as string | undefined) ?? ""}
              onChange={(val) => set("respiracion", val)}
              options={["Normal", "Agitada", "Tos fuerte"]}
            />
            <Select
              label="Energía"
              value={(getVal("energia") as string | undefined) ?? ""}
              onChange={(val) => set("energia", val)}
              options={["Baja 😴", "Media 🙂", "Alta 😃"]}
            />
            <Select
              label="Síntomas nuevos hoy"
              value={(getVal("sintomas") as string | undefined) ?? ""}
              onChange={(val) => set("sintomas", val)}
              options={["Ninguno", "Mareo", "Náuseas", "Diarrea", "Estreñimiento", "Otro"]}
            />
          </SectionCard>
        );

      case "movilidad":
        return (
          <SectionCard title="Movilidad y riesgo de caídas" subtitle="Marcha, equilibrio, caídas o casi caídas">
            <Select
              label="¿Caminó hoy?"
              value={(getVal("camino") as string | undefined) ?? ""}
              onChange={(val) => set("camino", val)}
              options={["Sí sin ayuda", "Con ayuda", "No"]}
            />
            <Select
              label="Equilibrio"
              value={(getVal("equilibrio") as string | undefined) ?? ""}
              onChange={(val) => set("equilibrio", val)}
              options={["🟢 Bien", "🟡 Inestable", "🔴 Muy inestable"]}
            />
            <Select
              label="¿Hubo caída o casi caída?"
              value={(getVal("caida") as string | undefined) ?? ""}
              onChange={(val) => set("caida", val)}
              options={["No", "Casi cae", "Sí cayó"]}
            />
            <YesNo
              label="¿Dolor al moverse?"
              value={(getVal("dolor_movimiento") as boolean | null | undefined) ?? null}
              onChange={(val) => set("dolor_movimiento", val)}
            />
          </SectionCard>
        );

      case "nutricion":
        return (
          <SectionCard title="Nutrición e hidratación" subtitle="Comidas, líquidos, evacuación y señales">
            <Select
              label="Comió"
              value={(getVal("comio") as string | undefined) ?? ""}
              onChange={(val) => set("comio", val)}
              options={["Bien", "Poco", "Nada"]}
            />
            <Select
              label="Tomó líquidos"
              value={(getVal("liquidos") as string | undefined) ?? ""}
              onChange={(val) => set("liquidos", val)}
              options={["Bien", "Poco", "Nada"]}
            />
            <YesNo
              label="¿Náuseas o vómito?"
              value={(getVal("vomito") as boolean | null | undefined) ?? null}
              onChange={(val) => set("vomito", val)}
            />
            <Select
              label="Evacuación"
              value={(getVal("evacuacion") as string | undefined) ?? ""}
              onChange={(val) => set("evacuacion", val)}
              options={["Normal", "Estreñimiento", "Diarrea", "No hizo"]}
            />
            <Input
              label="Señales de deshidratación (opcional)"
              value={(getVal("deshidratacion") as string | undefined) ?? ""}
              onChange={(val) => set("deshidratacion", val)}
              placeholder="boca seca / orina muy amarilla / mareo…"
            />
          </SectionCard>
        );

      case "medicacion":
        return (
          <SectionCard title="Medicación" subtitle="Adherencia, olvidos y efectos">
            <Select
              label="¿Tomó medicamentos como se indicó?"
              value={(getVal("adherencia") as string | undefined) ?? ""}
              onChange={(val) => set("adherencia", val)}
              options={["Sí", "Parcial", "No"]}
            />
            <YesNo
              label="¿Se olvidó alguna dosis?"
              value={(getVal("olvido") as boolean | null | undefined) ?? null}
              onChange={(val) => set("olvido", val)}
            />
            <Select
              label="¿Efectos secundarios?"
              value={(getVal("efectos") as string | undefined) ?? ""}
              onChange={(val) => set("efectos", val)}
              options={["No", "Sueño excesivo", "Mareo", "Dolor estómago", "Otro"]}
            />
            <Input
              label="Lista rápida (opcional)"
              value={(getVal("lista") as string | undefined) ?? ""}
              onChange={(val) => set("lista", val)}
              placeholder="Medicamento – hora (ej: Losartán 8:00am)"
            />
          </SectionCard>
        );

      case "sueno":
        return (
          <SectionCard title="Sueño" subtitle="Calidad, despertares y descanso">
            <Select
              label="Calidad del sueño"
              value={(getVal("calidad") as string | undefined) ?? ""}
              onChange={(val) => set("calidad", val)}
              options={["Buena", "Regular", "Mala"]}
            />
            <YesNo
              label="¿Se despertó varias veces?"
              value={(getVal("despertares") as boolean | null | undefined) ?? null}
              onChange={(val) => set("despertares", val)}
            />
            <Input
              label="Observaciones (opcional)"
              value={(getVal("observaciones_sueno") as string | undefined) ?? ""}
              onChange={(val) => set("observaciones_sueno", val)}
              placeholder="Ej: ronquidos, dolor nocturno…"
            />
          </SectionCard>
        );

      case "cognicion_emocional":
        return (
          <SectionCard title="Cognición y estado emocional" subtitle="Ánimo y percepción">
            <Select
              label="Ansiedad (1–5)"
              value={(getVal("ansiedad") as string | undefined) ?? ""}
              onChange={(val) => set("ansiedad", val)}
              options={SCALE_1_5}
            />
            <Select
              label="Estrés (1–5)"
              value={(getVal("estres") as string | undefined) ?? ""}
              onChange={(val) => set("estres", val)}
              options={SCALE_1_5}
            />
            <Input
              label="Cambios importantes (opcional)"
              value={(getVal("cambios") as string | undefined) ?? ""}
              onChange={(val) => set("cambios", val)}
              placeholder="Ej: más olvidos, llanto, agitación…"
            />
          </SectionCard>
        );

      case "entorno_cuidador":
        return (
          <SectionCard title="Entorno y cuidador" subtitle="Seguridad y carga">
            <Select
              label="Entorno"
              value={(getVal("entorno") as string | undefined) ?? ""}
              onChange={(val) => set("entorno", val)}
              options={["Seguro", "Con riesgos", "No evaluado"]}
            />
            <Select
              label="Carga del cuidador (1–5)"
              value={(getVal("carga") as string | undefined) ?? ""}
              onChange={(val) => set("carga", val)}
              options={SCALE_1_5}
            />
          </SectionCard>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-700">Cargando reporte…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* fondo tenue */}
      <div className="fixed inset-0 -z-10 opacity-18 pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BG_IMG} alt="Care background" className="w-full h-full object-cover" />
      </div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/85 via-white/75 to-white/90" />

      <div className="mx-auto max-w-3xl p-6 space-y-6">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 backdrop-blur-md p-6 shadow-[0_18px_55px_rgba(2,6,23,0.06)]">
          <h1 className="text-2xl font-black text-slate-900">Reporte diario</h1>
          <p className="text-sm text-slate-600 font-medium mt-1">Completa el reporte en 3 pasos.</p>

          <div className="mt-4">
            <ProgressBar value={Math.round(((groupIndex + 1) / stepGroups.length) * 100)} />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Paso {groupIndex + 1} de {stepGroups.length}</span>
              <span>{currentGroup.title}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 backdrop-blur-md p-6 shadow-[0_18px_55px_rgba(2,6,23,0.06)]">
          <h2 className="text-xl font-black text-slate-900">{currentGroup.title}</h2>
          <p className="text-sm text-slate-600 font-medium mt-1">{currentGroup.subtitle}</p>

          <div className="mt-6 space-y-5">
            {currentGroup.keys.map((k) => (
              <div key={k}>{renderFields(k)}</div>
            ))}

            {isLastGroup ? (
              <SectionCard title="Cierre" subtitle="Notas finales del reporte">
                <Textarea
                  label="Nota corta (opcional)"
                  value={formData.notaCorta}
                  onChange={(val) => setFormData((p) => ({ ...p, notaCorta: val }))}
                  placeholder="Ej: hoy estuvo más cansado de lo normal…"
                />
                <Textarea
                  label="Observaciones (opcional)"
                  value={formData.observaciones}
                  onChange={(val) => setFormData((p) => ({ ...p, observaciones: val }))}
                  placeholder="Ej: vigilar hidratación, contactar profesional si…"
                />
              </SectionCard>
            ) : null}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={groupIndex === 0 || saving}
              className="px-5 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 font-black disabled:opacity-50 hover:bg-slate-50"
            >
              Atrás
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/20 disabled:opacity-50 hover:bg-emerald-700"
            >
              {groupIndex < stepGroups.length - 1 ? "Siguiente" : saving ? "Guardando…" : "Guardar reporte"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* UI */

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/80 backdrop-blur-md p-6 shadow-[0_18px_55px_rgba(2,6,23,0.06)]">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="relative">
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-600 font-medium mt-1">{subtitle}</p> : null}
        <div className="mt-5 space-y-5">{children}</div>
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700" style={{ width: `${v}%` }} />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecciona…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-black text-slate-700">{label}</p>
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-5 py-3 rounded-2xl border font-black text-sm transition-all active:scale-[0.98] ${
            value === true
              ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
          }`}
          onClick={() => onChange(true)}
        >
          Sí
        </button>
        <button
          type="button"
          className={`px-5 py-3 rounded-2xl border font-black text-sm transition-all active:scale-[0.98] ${
            value === false
              ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10"
              : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
          }`}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <textarea
        className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}