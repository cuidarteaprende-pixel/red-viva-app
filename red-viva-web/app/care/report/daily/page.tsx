"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

/**
 * Tipos base (sin any)
 */
type Severity = "baja" | "media" | "alta";

type StepKey =
  | "salud_fisica"
  | "movilidad"
  | "nutricion"
  | "medicacion"
  | "higiene_piel"
  | "sueno"
  | "cognicion_emocional"
  | "entorno_cuidador";

type StepData = Record<string, unknown>; // campos internos por esfera

type Respuestas = Record<StepKey, StepData>;

type FormData = {
  fechaHora: string; // ISO string
  respuestas: Respuestas;
  observaciones: string;
};

type StepDef = {
  key: StepKey;
  title: string;
  subtitle: string;
};

/**
 * Helpers
 */
function nowIsoLocal(): string {
  // ISO local (sin Z) para UI; si prefieres ISO completo con Z, usa new Date().toISOString()
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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

export default function DailyReportPage() {
  const router = useRouter();

  // 🔧 Ajusta si tú ya traes adultoId y caregiver desde otro lado (context, params, etc.)
  // TODO: Reemplaza por tu lógica real de identificación:
  const [adultoId] = useState<string | null>(null);
  const [caregiverId] = useState<string | null>(null);

  const steps: StepDef[] = useMemo(
    () => [
      {
        key: "salud_fisica",
        title: "Salud física y signos",
        subtitle: "Chequeo simple (dolor, fiebre, respiración, energía).",
      },
      {
        key: "movilidad",
        title: "Movilidad y riesgo de caídas",
        subtitle: "Marcha, equilibrio, caídas o casi caídas.",
      },
      {
        key: "nutricion",
        title: "Nutrición e hidratación",
        subtitle: "Comidas, líquidos, evacuación y señales de deshidratación.",
      },
      {
        key: "medicacion",
        title: "Medicación",
        subtitle: "Adherencia, olvidos y efectos secundarios.",
      },
      {
        key: "higiene_piel",
        title: "Higiene, piel e incontinencia",
        subtitle: "Integridad de piel, lesiones y cuidado personal.",
      },
      {
        key: "sueno",
        title: "Sueño y descanso",
        subtitle: "Calidad del sueño, despertares y agitación nocturna.",
      },
      {
        key: "cognicion_emocional",
        title: "Cognición y estado emocional",
        subtitle: "Orientación, confusión y estado de ánimo.",
      },
      {
        key: "entorno_cuidador",
        title: "Entorno + social + cuidador",
        subtitle: "Riesgos en casa, interacción social y carga del cuidador.",
      },
    ],
    []
  );

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [saving, setSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    fechaHora: nowIsoLocal(),
    respuestas: ensureRespuestas(),
    observaciones: "",
  });

  const currentStep = steps[stepIndex];

  /**
   * ✅ ESTA ES LA FUNCIÓN QUE TE MARCABA EN ROJO
   * Ahora está bien tipada y no usa any / unknown indexado
   */
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

  const handlePrev = () => setStepIndex((i) => Math.max(0, i - 1));

  const handleNext = async () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    await handleSubmit();
  };

  const handleSubmit = async () => {
    // Validación mínima (ajústala a tu flujo real)
    if (!adultoId || !caregiverId) {
      toast.error("No se identificó el adulto mayor o el cuidador. Inicia sesión nuevamente.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        adulto_id: adultoId,
        cuidador_id: caregiverId,
        tipo_reporte: "diario",
        // OJO: si tu BD espera fecha separada, divídela aquí
        fecha_hora: new Date(formData.fechaHora).toISOString(),
        respuestas: formData.respuestas,
        observaciones: formData.observaciones || null,
      };

      // TODO: Ajusta el nombre de la tabla a la que realmente insertas
      const { error } = await supabase.from("reportes_cuidador").insert(payload);

      if (error) {
        toast.error("No se pudo guardar el reporte. Revisa conexión o permisos.");
        return;
      }

      toast.success("Reporte del día guardado correctamente.");
      router.push("/care/home"); // TODO: ajusta ruta si es distinta
    } finally {
      setSaving(false);
    }
  };

  /**
   * UI de campos (básico y claro)
   * Puedes reemplazar por tus componentes, pero este compila y sirve.
   */
  const renderFields = (k: StepKey) => {
    // helper para leer valores
    const v = (field: string) => formData.respuestas[k]?.[field];

    // helper para set
    const set = (field: string, value: unknown) => updateStepData(k, field, value);

    switch (k) {
      case "salud_fisica":
        return (
          <div className="space-y-4">
            <Select
              label="Dolor"
              value={(v("dolor") as string | undefined) ?? ""}
              onChange={(val) => set("dolor", val)}
              options={["Nada", "Leve", "Moderado", "Fuerte", "10/10"]}
            />
            <YesNo
              label="¿Fiebre o sensación de fiebre?"
              value={(v("fiebre") as boolean | undefined) ?? null}
              onChange={(val) => set("fiebre", val)}
            />
            <Select
              label="Respiración"
              value={(v("respiracion") as string | undefined) ?? ""}
              onChange={(val) => set("respiracion", val)}
              options={["Normal", "Agitada", "Tos fuerte"]}
            />
            <Select
              label="Energía"
              value={(v("energia") as string | undefined) ?? ""}
              onChange={(val) => set("energia", val)}
              options={["Baja 😴", "Media 🙂", "Alta 😃"]}
            />
            <Select
              label="Síntomas nuevos hoy"
              value={(v("sintomas") as string | undefined) ?? ""}
              onChange={(val) => set("sintomas", val)}
              options={["Ninguno", "Mareo", "Náuseas", "Diarrea", "Estreñimiento", "Otro"]}
            />
            <Input
              label="Nota corta (opcional)"
              value={(v("nota") as string | undefined) ?? ""}
              onChange={(val) => set("nota", val)}
              placeholder="¿Qué notaste?"
            />
          </div>
        );

      case "movilidad":
        return (
          <div className="space-y-4">
            <Select
              label="¿Caminó hoy?"
              value={(v("camino") as string | undefined) ?? ""}
              onChange={(val) => set("camino", val)}
              options={["Sí sin ayuda", "Con ayuda", "No"]}
            />
            <Select
              label="Equilibrio"
              value={(v("equilibrio") as string | undefined) ?? ""}
              onChange={(val) => set("equilibrio", val)}
              options={["🟢 Bien", "🟡 Inestable", "🔴 Muy inestable"]}
            />
            <Select
              label="¿Hubo caída o casi caída?"
              value={(v("caida") as string | undefined) ?? ""}
              onChange={(val) => set("caida", val)}
              options={["No", "Casi cae", "Sí cayó"]}
            />
            <YesNo
              label="¿Dolor al moverse?"
              value={(v("dolor_movimiento") as boolean | undefined) ?? null}
              onChange={(val) => set("dolor_movimiento", val)}
            />
          </div>
        );

      case "nutricion":
        return (
          <div className="space-y-4">
            <Select label="Comió" value={(v("comio") as string | undefined) ?? ""} onChange={(val) => set("comio", val)} options={["Bien", "Poco", "Nada"]} />
            <Select label="Tomó líquidos" value={(v("liquidos") as string | undefined) ?? ""} onChange={(val) => set("liquidos", val)} options={["Bien", "Poco", "Nada"]} />
            <YesNo label="¿Náuseas o vómito?" value={(v("vomito") as boolean | undefined) ?? null} onChange={(val) => set("vomito", val)} />
            <Select label="Evacuación" value={(v("evacuacion") as string | undefined) ?? ""} onChange={(val) => set("evacuacion", val)} options={["Normal", "Estreñimiento", "Diarrea", "No hizo"]} />
            <Input
              label="Señales de deshidratación (opcional)"
              value={(v("deshidratacion") as string | undefined) ?? ""}
              onChange={(val) => set("deshidratacion", val)}
              placeholder="boca seca / orina muy amarilla / mareo…"
            />
          </div>
        );

      case "medicacion":
        return (
          <div className="space-y-4">
            <Select
              label="¿Tomó medicamentos como se indicó?"
              value={(v("adherencia") as string | undefined) ?? ""}
              onChange={(val) => set("adherencia", val)}
              options={["Sí", "Parcial", "No"]}
            />
            <YesNo label="¿Se olvidó alguna dosis?" value={(v("olvido") as boolean | undefined) ?? null} onChange={(val) => set("olvido", val)} />
            <Select
              label="¿Efectos secundarios?"
              value={(v("efectos") as string | undefined) ?? ""}
              onChange={(val) => set("efectos", val)}
              options={["No", "Sueño excesivo", "Mareo", "Dolor estómago", "Otro"]}
            />
            <Input
              label="Lista rápida (opcional)"
              value={(v("lista") as string | undefined) ?? ""}
              onChange={(val) => set("lista", val)}
              placeholder="Medicamento – hora (ej: Losartán 8:00am)"
            />
          </div>
        );

      case "higiene_piel":
        return (
          <div className="space-y-4">
            <Select label="Higiene" value={(v("higiene") as string | undefined) ?? ""} onChange={(val) => set("higiene", val)} options={["Completa", "Parcial", "No se pudo"]} />
            <Select label="Piel" value={(v("piel") as string | undefined) ?? ""} onChange={(val) => set("piel", val)} options={["🟢 Bien", "🟡 Enrojecida", "🔴 Herida o llaga"]} />
            <Select label="Incontinencia" value={(v("incontinencia") as string | undefined) ?? ""} onChange={(val) => set("incontinencia", val)} options={["No", "Orina", "Heces", "Ambas"]} />
            <Input label="Si hay lesión: ubicación (opcional)" value={(v("lesion_ubicacion") as string | undefined) ?? ""} onChange={(val) => set("lesion_ubicacion", val)} placeholder="sacro / talón / cadera / otro" />
          </div>
        );

      case "sueno":
        return (
          <div className="space-y-4">
            <Select label="Durmió" value={(v("durmio") as string | undefined) ?? ""} onChange={(val) => set("durmio", val)} options={["😴 Mal", "🙂 Regular", "😃 Bien"]} />
            <YesNo label="¿Se despertó muchas veces?" value={(v("despertares") as boolean | undefined) ?? null} onChange={(val) => set("despertares", val)} />
            <YesNo label="¿Agitación nocturna?" value={(v("agitacion") as boolean | undefined) ?? null} onChange={(val) => set("agitacion", val)} />
            <Select label="Siestas" value={(v("siestas") as string | undefined) ?? ""} onChange={(val) => set("siestas", val)} options={["No", "Sí (corta)", "Sí (larga)"]} />
          </div>
        );

      case "cognicion_emocional":
        return (
          <div className="space-y-4">
            <Select label="¿Estuvo orientado?" value={(v("orientado") as string | undefined) ?? ""} onChange={(val) => set("orientado", val)} options={["Sí", "A veces", "No"]} />
            <Select label="Memoria hoy" value={(v("memoria") as string | undefined) ?? ""} onChange={(val) => set("memoria", val)} options={["Bien", "Regular", "Mal"]} />
            <YesNo label="¿Confusión o delirios?" value={(v("confusion") as boolean | undefined) ?? null} onChange={(val) => set("confusion", val)} />
            <Select label="Ánimo" value={(v("animo") as string | undefined) ?? ""} onChange={(val) => set("animo", val)} options={["😟 Bajo", "😐 Neutro", "🙂 Bueno"]} />
            <Select label="Ansiedad (1–5)" value={(v("ansiedad") as string | undefined) ?? ""} onChange={(val) => set("ansiedad", val)} options={["1", "2", "3", "4", "5"]} />
            <YesNo label="¿Irritabilidad/enojo?" value={(v("enojo") as boolean | undefined) ?? null} onChange={(val) => set("enojo", val)} />
          </div>
        );

      case "entorno_cuidador":
        return (
          <div className="space-y-4">
            <Select
              label="Riesgos en casa hoy"
              value={(v("riesgos") as string | undefined) ?? ""}
              onChange={(val) => set("riesgos", val)}
              options={["Ninguno", "Piso mojado", "Alfombras", "Mala luz", "Otro"]}
            />
            <YesNo label="¿Usó ayudas (bastón/caminador)?" value={(v("ayudas") as boolean | undefined) ?? null} onChange={(val) => set("ayudas", val)} />
            <Select label="¿Interacción social hoy?" value={(v("social") as string | undefined) ?? ""} onChange={(val) => set("social", val)} options={["Sí", "No"]} />
            <Select label="¿Cómo te sientes tú hoy?" value={(v("cuidador_estado") as string | undefined) ?? ""} onChange={(val) => set("cuidador_estado", val)} options={["😵 Muy cansado", "😐 Normal", "🙂 Bien"]} />
            <Select label="Estrés (1–5)" value={(v("estres") as string | undefined) ?? ""} onChange={(val) => set("estres", val)} options={["1", "2", "3", "4", "5"]} />
            <YesNo label="¿Necesitas apoyo?" value={(v("apoyo") as boolean | undefined) ?? null} onChange={(val) => set("apoyo", val)} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Reporte Diario 360°</h1>
          <p className="text-slate-600">Completa el formulario paso a paso. Toma menos de 3 minutos.</p>
        </header>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Paso {stepIndex + 1} / {steps.length}
              </p>
              <h2 className="text-xl font-black text-slate-900">{currentStep.title}</h2>
              <p className="text-slate-600 text-sm">{currentStep.subtitle}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            <Input
              label="Fecha y hora de diligenciamiento"
              value={formData.fechaHora}
              onChange={(val) => setFormData((p) => ({ ...p, fechaHora: val }))}
              placeholder="YYYY-MM-DDTHH:mm"
            />

            {renderFields(currentStep.key)}

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Observaciones libres (opcional)
              </label>
              <textarea
                className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:ring-4 focus:ring-blue-100"
                placeholder="Cuéntanos con tus palabras qué pasó hoy…"
                value={formData.observaciones}
                onChange={(e) => setFormData((p) => ({ ...p, observaciones: e.target.value }))}
              />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={stepIndex === 0 || saving}
                className="rounded-2xl px-4 py-3 font-bold text-slate-700 disabled:opacity-40"
              >
                Volver
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={saving}
                className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white shadow-sm active:scale-[0.99] disabled:opacity-60"
              >
                {saving ? "Guardando…" : stepIndex === steps.length - 1 ? "Guardar reporte" : "Siguiente"}
              </button>
            </div>

            {/* Nota UX: Botón rápido a urgencia (mantiene tu flujo de eventos) */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.push("/care/report/urgent")}
                className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 font-black text-rose-700"
              >
                Reportar urgencia (evento crítico)
              </button>
              <p className="mt-2 text-xs text-slate-500">
                Si ocurrió una caída, confusión severa o algo urgente, repórtalo aquí.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componentes UI simples y a prueba de cuidadores (botones grandes, claros)
 */

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
    <div>
      <label className="block text-sm font-bold text-slate-900 mb-2">{label}</label>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
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
    <div>
      <label className="block text-sm font-bold text-slate-900 mb-2">{label}</label>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-4 focus:ring-blue-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecciona…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
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
    <div>
      <p className="block text-sm font-bold text-slate-900 mb-2">{label}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 rounded-2xl px-4 py-3 font-black ${
            value === true ? "bg-emerald-600 text-white" : "bg-slate-50 border border-slate-200 text-slate-800"
          }`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 rounded-2xl px-4 py-3 font-black ${
            value === false ? "bg-rose-600 text-white" : "bg-slate-50 border border-slate-200 text-slate-800"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}