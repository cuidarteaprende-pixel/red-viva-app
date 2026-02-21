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

type InsertResult<T> = { data: T[] | null; error: { message: string } | null };

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

export default function DailyReportPage() {
  const router = useRouter();

  const [adultoId, setAdultoId] = useState<string | null>(null);
  const [adultoNombre, setAdultoNombre] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Debug para ti
  const [debugMsg, setDebugMsg] = useState<string>("");

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

  useEffect(() => {
    async function loadAdulto() {
      setDebugMsg("");
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Si NO hay sesión y DEMO_MODE es true: tomar primer adulto
        if (!session && DEMO_MODE) {
          setDebugMsg("🟡 DEMO_MODE activo: sin sesión. Tomando primer adulto.");

          const { data: fallbackAm, error: famErr } = await supabase
            .from("adultos_mayores")
            .select("id,nombre")
            .order("id", { ascending: true })
            .limit(1)
            .maybeSingle<DbAdulto>();

          if (famErr) {
            setDebugMsg((p) => p + `\n❌ Error leyendo adultos_mayores: ${famErr.message}`);
          }

          if (fallbackAm?.id) {
            setAdultoId(fallbackAm.id);
            setAdultoNombre(fallbackAm.nombre ?? "");
            setDebugMsg((p) => p + `\n✅ adulto_id: ${fallbackAm.id}`);
          } else {
            setDebugMsg((p) => p + `\n❌ No hay adultos_mayores en la tabla.`);
          }

          toast.info("Modo Demo activo", {
            description: "Se usará el primer adulto mayor para validar el formulario.",
          });

          return;
        }

        // Si NO hay sesión y NO demo
        if (!session && !DEMO_MODE) {
          toast.error("Sesión no detectada", {
            description: "Debes iniciar sesión o activar DEMO_MODE=true.",
          });
          setDebugMsg("❌ No hay sesión y DEMO_MODE está apagado.");
          return;
        }

        // Si hay sesión, por ahora también tomamos primer adulto (para demo estable)
        // (Luego lo volvemos “real” por asignación)
        setDebugMsg("✅ Sesión detectada. (Por ahora usando primer adulto como fallback).");

        const { data: fallbackAm, error: famErr } = await supabase
          .from("adultos_mayores")
          .select("id,nombre")
          .order("id", { ascending: true })
          .limit(1)
          .maybeSingle<DbAdulto>();

        if (famErr) {
          setDebugMsg((p) => p + `\n❌ Error leyendo adultos_mayores: ${famErr.message}`);
        }

        if (fallbackAm?.id) {
          setAdultoId(fallbackAm.id);
          setAdultoNombre(fallbackAm.nombre ?? "");
          setDebugMsg((p) => p + `\n✅ adulto_id: ${fallbackAm.id}`);
        } else {
          setDebugMsg((p) => p + `\n❌ No hay adultos_mayores en la tabla.`);
        }
      } catch (e) {
        setDebugMsg(`❌ Error inesperado: ${String(e)}`);
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

  // Inserción adaptada a tu esquema (adulto_id FK, cuidador_nombre opcional, contenido)
  async function insertReporteDiario(): Promise<InsertResult<Record<string, unknown>>> {
    if (!adultoId) return { data: null, error: { message: "adultoId es null" } };

    const contenido: Record<string, unknown> = {
      respuestas: formData.respuestas,
      notaCorta: formData.notaCorta || "—",
      observaciones: formData.observaciones || "—",
      fechaHoraLocal: formData.fechaHora,
    };

    const payload: Record<string, unknown> = {
      adulto_id: adultoId,
      tipo_reporte: "diario",
      contenido, // si en tu DB es JSON/JSONB funciona perfecto
      cuidador_nombre: DEMO_MODE ? "Cuidador Demo" : "Cuidador",
    };

    const { data, error } = await supabase.from("reportes_cuidador").insert(payload).select();
    if (error) return { data: null, error: { message: error.message } };

    return { data: (data ?? []) as Record<string, unknown>[], error: null };
  }

  const handleSubmit = async () => {
    setDebugMsg((p) => p + "\n\n🟣 Intentando guardar reporte…");

    if (!adultoId) {
      toast.error("No se puede guardar el reporte", {
        description: "Falta identificar el adulto. Revisa debug abajo.",
      });
      setDebugMsg((p) => p + "\n❌ adultoId=null");
      return;
    }

    setSaving(true);

    try {
      const result = await insertReporteDiario();

      if (result.error) {
        toast.error("No se pudo guardar el reporte", { description: result.error.message });
        setDebugMsg((p) => p + `\n❌ INSERT ERROR: ${result.error?.message}`);
        return;
      }

      toast.success("Reporte guardado", { description: "Redirigiendo…" });
      setDebugMsg((p) => p + `\n✅ Guardado OK. Filas: ${result.data?.length ?? 0}`);

      router.push(`/care/report/daily/success?adulto=${encodeURIComponent(adultoNombre || "")}`);
    } catch (e) {
      toast.error("Error inesperado", { description: String(e) });
      setDebugMsg((p) => p + `\n❌ ERROR: ${String(e)}`);
    } finally {
      setSaving(false);
    }
  };

  const renderFields = (k: StepKey) => {
    const step = formData.respuestas[k];
    const getVal = (field: string) => (step?.[field] as unknown);

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

      case "higiene_piel":
        return (
          <SectionCard title="Higiene, piel e incontinencia" subtitle="Integridad de piel, lesiones y cuidado">
            <Select
              label="Higiene"
              value={(getVal("higiene") as string | undefined) ?? ""}
              onChange={(val) => set("higiene", val)}
              options={["Completa", "Parcial", "No se pudo"]}
            />
            <Select
              label="Piel"
              value={(getVal("piel") as string | undefined) ?? ""}
              onChange={(val) => set("piel", val)}
              options={["🟢 Bien", "🟡 Enrojecida", "🔴 Herida o llaga"]}
            />
            <YesNo
              label="¿Hay incontinencia hoy?"
              value={(getVal("incontinencia") as boolean | null | undefined) ?? null}
              onChange={(val) => set("incontinencia", val)}
            />
            <YesNo
              label="¿Hubo cambio de pañal/ropa a tiempo?"
              value={(getVal("cambio_panal") as boolean | null | undefined) ?? null}
              onChange={(val) => set("cambio_panal", val)}
            />
            <Input
              label="Zonas afectadas (si aplica)"
              value={(getVal("zonas") as string | undefined) ?? ""}
              onChange={(val) => set("zonas", val)}
              placeholder="Ej: sacro, talones, caderas…"
            />
            <Input
              label="Observaciones (opcional)"
              value={(getVal("observaciones_piel") as string | undefined) ?? ""}
              onChange={(val) => set("observaciones_piel", val)}
              placeholder="Ej: enrojecimiento leve, aplicar crema…"
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
            <Select
              label="Siestas"
              value={(getVal("siestas") as string | undefined) ?? ""}
              onChange={(val) => set("siestas", val)}
              options={["No", "Sí, corta", "Sí, larga"]}
            />
            <Input
              label="Horas aproximadas dormidas (opcional)"
              value={(getVal("horas") as string | undefined) ?? ""}
              onChange={(val) => set("horas", val)}
              placeholder="Ej: 6.5"
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
          <SectionCard title="Cognición y estado emocional" subtitle="Ánimo, orientación y conducta">
            <Select
              label="Estado de ánimo"
              value={(getVal("animo") as string | undefined) ?? ""}
              onChange={(val) => set("animo", val)}
              options={["🙂 Bien", "😐 Neutro", "😟 Triste", "😠 Irritable", "😰 Ansioso"]}
            />
            <YesNo
              label="¿Hubo confusión o desorientación?"
              value={(getVal("confusion") as boolean | null | undefined) ?? null}
              onChange={(val) => set("confusion", val)}
            />
            <Select
              label="Interacción / comunicación"
              value={(getVal("interaccion") as string | undefined) ?? ""}
              onChange={(val) => set("interaccion", val)}
              options={["Normal", "Más callado", "Agitado", "No quiso hablar"]}
            />
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
              placeholder="Ej: más olvidos, llanto, agresividad…"
            />
          </SectionCard>
        );

      case "entorno_cuidador":
        return (
          <SectionCard title="Entorno y cuidador" subtitle="Seguridad del entorno y carga del cuidador">
            <Select
              label="Entorno"
              value={(getVal("entorno") as string | undefined) ?? ""}
              onChange={(val) => set("entorno", val)}
              options={["Seguro", "Con riesgos (alfombras, escalones…)", "No evaluado"]}
            />
            <YesNo
              label="¿Hubo algún incidente en casa hoy?"
              value={(getVal("incidente") as boolean | null | undefined) ?? null}
              onChange={(val) => set("incidente", val)}
            />
            <Select
              label="Carga del cuidador"
              value={(getVal("carga") as string | undefined) ?? ""}
              onChange={(val) => set("carga", val)}
              options={SCALE_1_5}
            />
            <Input
              label="Nota final del cuidador (opcional)"
              value={(getVal("nota") as string | undefined) ?? ""}
              onChange={(val) => set("nota", val)}
              placeholder="Ej: hoy fue difícil por…, necesito apoyo en…"
            />
          </SectionCard>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-700">Cargando reporte…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Reporte diario</h1>
          <p className="text-sm text-slate-600 mt-1">Completa el reporte en 3 pasos.</p>

          <div className="mt-4">
            <ProgressBar value={Math.round(((groupIndex + 1) / stepGroups.length) * 100)} />
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>
                Paso {groupIndex + 1} de {stepGroups.length}
              </span>
              <span>{currentGroup.title}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{currentGroup.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{currentGroup.subtitle}</p>

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
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 disabled:opacity-50"
            >
              Atrás
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-medium disabled:opacity-50"
            >
              {groupIndex < stepGroups.length - 1 ? "Siguiente" : saving ? "Guardando…" : "Guardar reporte"}
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700 mb-2">DEBUG</p>
            <pre className="text-xs text-slate-700 whitespace-pre-wrap">
{`DEMO_MODE: ${DEMO_MODE}
adultoId: ${adultoId ?? "null"}
adultoNombre: ${adultoNombre || "—"}

${debugMsg || "(sin debug)"}
`}
            </pre>
          </div>
        </div>
      </div>
    </div>
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
      <div className="h-full bg-emerald-600" style={{ width: `${v}%` }} />
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
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-xl border ${
            value === true
              ? "bg-emerald-50 border-emerald-400 text-emerald-800"
              : "bg-white border-slate-300 text-slate-800"
          }`}
          onClick={() => onChange(true)}
        >
          Sí
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-xl border ${
            value === false
              ? "bg-emerald-50 border-emerald-400 text-emerald-800"
              : "bg-white border-slate-300 text-slate-800"
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
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        className="w-full min-h-[110px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}