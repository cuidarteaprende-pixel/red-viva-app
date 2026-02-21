"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

/**
 * Tipos base
 */
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

type FormData = {
  fechaHora: string;
  respuestas: Respuestas;
  observaciones: string; // solo al final
  notaGeneral: string; // solo al final
};

type StepDef = {
  key: StepKey;
  title: string;
  subtitle: string;
};

type StepGroup = {
  title: string;
  subtitle: string;
  keys: StepKey[];
};

/**
 * Helpers
 */
function nowIsoLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
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

const DEMO_CUIDADOR_ID = "00000000-0000-0000-0000-000000000001";

export default function DailyReportPage() {
  const router = useRouter();
  const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const [adultoId, setAdultoId] = useState<string | null>(null);
  const [adultoNombre, setAdultoNombre] = useState<string | null>(null);
  const [caregiverId, setCaregiverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión + ids
  useEffect(() => {
    let cancelled = false;

    async function safeSet(partial: {
      adultoId?: string | null;
      caregiverId?: string | null;
      adultoNombre?: string | null;
    }) {
      if (cancelled) return;
      if ("adultoId" in partial) setAdultoId(partial.adultoId ?? null);
      if ("caregiverId" in partial) setCaregiverId(partial.caregiverId ?? null);
      if ("adultoNombre" in partial) setAdultoNombre(partial.adultoNombre ?? null);
    }

    async function fetchAdultName(id: string) {
      // adultos_mayores aparece UNRESTRICTED en tu Supabase, esto debería funcionar.
      const { data, error } = await supabase
        .from("adultos_mayores")
        .select("nombre")
        .eq("id", id)
        .maybeSingle();

      if (error) console.error("[ADULTO] nombre error:", error);
      return (data?.nombre as string | undefined) ?? null;
    }

    async function loadForLoggedUser(authUserId: string) {
      const { data: cg, error: cgErr } = await supabase
        .from("cuidadores")
        .select("id")
        .eq("auth_user_id", authUserId)
        .maybeSingle();

      if (cgErr) console.error("[SESSION] cuidador error:", cgErr);

      const cgId = cg?.id ?? null;
      await safeSet({ caregiverId: cgId });

      if (!cgId) return;

      const { data: assignments, error: asErr } = await supabase
        .from("asignaciones_cuidado")
        .select("adulto_id")
        .eq("cuidador_id", cgId)
        .limit(1);

      if (asErr) console.error("[SESSION] asignaciones error:", asErr);

      const firstAdult = assignments?.[0]?.adulto_id as string | undefined;
      if (firstAdult) {
        const name = await fetchAdultName(firstAdult);
        await safeSet({ adultoId: firstAdult, adultoNombre: name });
      }
    }

    async function loadForDemo() {
      console.warn("[DEMO_MODE] Sin sesión. Cargando adulto de prueba.");

      const { data: anyAdult, error } = await supabase
        .from("adultos_mayores")
        .select("id, nombre")
        .limit(1)
        .maybeSingle();

      if (error) console.error("[DEMO_MODE] adultos_mayores error:", error);

      await safeSet({
        adultoId: (anyAdult?.id as string | undefined) ?? null,
        adultoNombre: (anyAdult?.nombre as string | undefined) ?? null,
        caregiverId: null, // puede quedar null; en submit usamos DEMO_CUIDADOR_ID
      });

      toast.info("Modo Demo activo", {
        description: "No se detectó sesión. Guardará con cuidador DEMO.",
      });
    }

    async function load() {
      try {
        const {
          data: { session },
          error: sessErr,
        } = await supabase.auth.getSession();

        if (sessErr) console.error("[SESSION] getSession error:", sessErr);

        if (session?.user?.id) {
          await loadForLoggedUser(session.user.id);
        } else if (DEMO_MODE) {
          await loadForDemo();
        } else {
          toast.error("Sesión no detectada", {
            description: "Debes iniciar sesión para guardar el reporte.",
          });
        }
      } catch (e) {
        console.error("Error cargando sesión:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [DEMO_MODE]);

  /**
   * Definición por sección
   */
  const stepsByKey: Record<StepKey, StepDef> = useMemo(
    () => ({
      salud_fisica: {
        key: "salud_fisica",
        title: "Salud física y signos",
        subtitle: "Chequeo simple (dolor, fiebre, respiración, energía).",
      },
      movilidad: {
        key: "movilidad",
        title: "Movilidad y riesgo de caídas",
        subtitle: "Marcha, equilibrio, caídas o casi caídas.",
      },
      nutricion: {
        key: "nutricion",
        title: "Nutrición e hidratación",
        subtitle: "Comidas, líquidos, evacuación y señales de deshidratación.",
      },
      medicacion: {
        key: "medicacion",
        title: "Medicación",
        subtitle: "Adherencia, olvidos y efectos secundarios.",
      },
      higiene_piel: {
        key: "higiene_piel",
        title: "Higiene, piel e incontinencia",
        subtitle: "Integridad de piel, lesiones y cuidado personal.",
      },
      sueno: {
        key: "sueno",
        title: "Sueño y descanso",
        subtitle: "Calidad del sueño, despertares y agitación nocturna.",
      },
      cognicion_emocional: {
        key: "cognicion_emocional",
        title: "Cognición y estado emocional",
        subtitle: "Orientación, confusión y estado de ánimo.",
      },
      entorno_cuidador: {
        key: "entorno_cuidador",
        title: "Entorno + social + cuidador",
        subtitle: "Riesgos en casa, interacción social y carga del cuidador.",
      },
    }),
    []
  );

  /**
   * ✅ 3 pasos (grupos)
   */
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

  const [stepIndex, setStepIndex] = useState<number>(0);
  const [saving, setSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    fechaHora: nowIsoLocal(),
    respuestas: ensureRespuestas(),
    observaciones: "",
    notaGeneral: "",
  });

  const currentGroup = stepGroups[stepIndex];
  const isLastGroup = stepIndex === stepGroups.length - 1;

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
    if (stepIndex < stepGroups.length - 1) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    await handleSubmit();
  };

  const handleSubmit = async () => {
    console.log("click guardar reporte", { adultoId, caregiverId, DEMO_MODE });

    // ✅ En demo permitimos caregiverId null
    if (!adultoId || (!caregiverId && !DEMO_MODE)) {
      toast.error("No se puede guardar: falta identificar perfil.", {
        description: DEMO_MODE
          ? "Falta adultoId. Revisa permisos o datos."
          : "Debes iniciar sesión para guardar el reporte.",
      });
      return;
    }

    const cuidadorIdFinal = caregiverId ?? DEMO_CUIDADOR_ID;

    setSaving(true);

    try {
      const notasFinales = [
        formData.notaGeneral?.trim()
          ? `Nota corta: ${formData.notaGeneral.trim()}`
          : null,
        formData.observaciones?.trim()
          ? `Observaciones: ${formData.observaciones.trim()}`
          : null,
      ]
        .filter(Boolean)
        .join("\n\n");

      const payload = {
        adulto_id: adultoId,
        cuidador_id: cuidadorIdFinal,
        tipo_reporte: "diario",
        fecha: new Date().toISOString().split("T")[0],
        respuestas: formData.respuestas,
        notas: notasFinales || null,
      };

      console.log("payload", payload);

      const { data, error } = await supabase
        .from("reportes_cuidador")
        .insert(payload)
        .select();

      console.log("insert result", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        toast.error("Error al guardar", {
          description: `${error.code ?? ""} ${error.message ?? ""} ${error.details ?? ""}`.trim(),
        });
        return;
      }

      // ✅ Redirigir a pantalla "Gracias"
      const nombre = adultoNombre?.trim() || "";
      const qs = nombre ? `?adulto=${encodeURIComponent(nombre)}` : "";
      router.push(`/care/report/daily/success${qs}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Ocurrió un error inesperado al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const renderFields = (k: StepKey) => {
    const v = (field: string) =>
      (formData.respuestas[k] as Record<string, unknown> | undefined)?.[field];
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
            <Select
              label="Comió"
              value={(v("comio") as string | undefined) ?? ""}
              onChange={(val) => set("comio", val)}
              options={["Bien", "Poco", "Nada"]}
            />
            <Select
              label="Tomó líquidos"
              value={(v("liquidos") as string | undefined) ?? ""}
              onChange={(val) => set("liquidos", val)}
              options={["Bien", "Poco", "Nada"]}
            />
            <YesNo
              label="¿Náuseas o vómito?"
              value={(v("vomito") as boolean | undefined) ?? null}
              onChange={(val) => set("vomito", val)}
            />
            <Select
              label="Evacuación"
              value={(v("evacuacion") as string | undefined) ?? ""}
              onChange={(val) => set("evacuacion", val)}
              options={["Normal", "Estreñimiento", "Diarrea", "No hizo"]}
            />
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
            <YesNo
              label="¿Se olvidó alguna dosis?"
              value={(v("olvido") as boolean | undefined) ?? null}
              onChange={(val) => set("olvido", val)}
            />
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
            <Select
              label="Higiene"
              value={(v("higiene") as string | undefined) ?? ""}
              onChange={(val) => set("higiene", val)}
              options={["Completa", "Parcial", "No se pudo"]}
            />
            <Select
              label="Piel"
              value={(v("piel") as string | undefined) ?? ""}
              onChange={(val) => set("piel", val)}
              options={["🟢 Bien", "🟡 Enrojecida", "🔴 Herida o llaga"]}
            />
            <Select
              label="Incontinencia"
              value={(v("incontinencia") as string | undefined) ?? ""}
              onChange={(val) => set("incontinencia", val)}
              options={["No", "Orina", "Heces", "Ambas"]}
            />
            <Input
              label="Si hay lesión: ubicación (opcional)"
              value={(v("lesion_ubicacion") as string | undefined) ?? ""}
              onChange={(val) => set("lesion_ubicacion", val)}
              placeholder="sacro / talón / cadera / otro"
            />
          </div>
        );

      case "sueno":
        return (
          <div className="space-y-4">
            <Select
              label="Durmió"
              value={(v("durmio") as string | undefined) ?? ""}
              onChange={(val) => set("durmio", val)}
              options={["😴 Mal", "🙂 Regular", "😃 Bien"]}
            />
            <YesNo
              label="¿Se despertó muchas veces?"
              value={(v("despertares") as boolean | undefined) ?? null}
              onChange={(val) => set("despertares", val)}
            />
            <YesNo
              label="¿Agitación nocturna?"
              value={(v("agitacion") as boolean | undefined) ?? null}
              onChange={(val) => set("agitacion", val)}
            />
            <Select
              label="Siestas"
              value={(v("siestas") as string | undefined) ?? ""}
              onChange={(val) => set("siestas", val)}
              options={["No", "Sí (corta)", "Sí (larga)"]}
            />
          </div>
        );

      case "cognicion_emocional":
        return (
          <div className="space-y-4">
            <Select
              label="¿Estuvo orientado?"
              value={(v("orientado") as string | undefined) ?? ""}
              onChange={(val) => set("orientado", val)}
              options={["Sí", "A veces", "No"]}
            />
            <Select
              label="Memoria hoy"
              value={(v("memoria") as string | undefined) ?? ""}
              onChange={(val) => set("memoria", val)}
              options={["Bien", "Regular", "Mal"]}
            />
            <YesNo
              label="¿Confusión o delirios?"
              value={(v("confusion") as boolean | undefined) ?? null}
              onChange={(val) => set("confusion", val)}
            />
            <Select
              label="Ánimo"
              value={(v("animo") as string | undefined) ?? ""}
              onChange={(val) => set("animo", val)}
              options={["😟 Bajo", "😐 Neutro", "🙂 Bueno"]}
            />
            <Select
              label="Ansiedad (1–5)"
              value={(v("ansiedad") as string | undefined) ?? ""}
              onChange={(val) => set("ansiedad", val)}
              options={["1", "2", "3", "4", "5"]}
            />
            <p className="text-xs text-slate-500 -mt-2">
              1 = Nada / tranquilo · 3 = Moderado · 5 = Muy alto
            </p>
            <YesNo
              label="¿Irritabilidad/enojo?"
              value={(v("enojo") as boolean | undefined) ?? null}
              onChange={(val) => set("enojo", val)}
            />
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
            <YesNo
              label="¿Usó ayudas (bastón/caminador)?"
              value={(v("ayudas") as boolean | undefined) ?? null}
              onChange={(val) => set("ayudas", val)}
            />
            <Select
              label="¿Interacción social hoy?"
              value={(v("social") as string | undefined) ?? ""}
              onChange={(val) => set("social", val)}
              options={["Sí", "No"]}
            />
            <Select
              label="¿Cómo te sientes tú hoy?"
              value={(v("cuidador_estado") as string | undefined) ?? ""}
              onChange={(val) => set("cuidador_estado", val)}
              options={["😵 Muy cansado", "😐 Normal", "🙂 Bien"]}
            />
            <Select
              label="Estrés (1–5)"
              value={(v("estres") as string | undefined) ?? ""}
              onChange={(val) => set("estres", val)}
              options={["1", "2", "3", "4", "5"]}
            />
            <p className="text-xs text-slate-500 -mt-2">
              1 = Bajo · 3 = Medio · 5 = Alto / sobrecarga
            </p>
            <YesNo
              label="¿Necesitas apoyo?"
              value={(v("apoyo") as boolean | undefined) ?? null}
              onChange={(val) => set("apoyo", val)}
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">
            Cargando datos del cuidador...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Reporte Diario 360°</h1>
          <p className="text-slate-600">Formulario simplificado a 3 pasos.</p>
        </header>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Paso {stepIndex + 1} / {stepGroups.length}
              </p>
              <h2 className="text-xl font-black text-slate-900">{currentGroup.title}</h2>
              <p className="text-slate-600 text-sm">{currentGroup.subtitle}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            <Input
              label="Fecha y hora de diligenciamiento"
              value={formData.fechaHora}
              onChange={(val) => setFormData((p) => ({ ...p, fechaHora: val }))}
              placeholder="YYYY-MM-DDTHH:mm"
            />

            {currentGroup.keys.map((k) => (
              <section
                key={k}
                className="mt-4 rounded-3xl border border-slate-100 bg-slate-50/50 p-4"
              >
                <h3 className="text-base font-black text-slate-900">{stepsByKey[k].title}</h3>
                <p className="text-sm text-slate-600">{stepsByKey[k].subtitle}</p>
                <div className="mt-3">{renderFields(k)}</div>
              </section>
            ))}

            {isLastGroup && (
              <div className="mt-2 grid gap-4">
                <Input
                  label="Nota corta general (opcional)"
                  value={formData.notaGeneral}
                  onChange={(val) => setFormData((p) => ({ ...p, notaGeneral: val }))}
                  placeholder="Algo breve y relevante"
                />

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Observaciones libres (opcional)
                  </label>
                  <textarea
                    className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="Cuéntanos con tus palabras qué pasó hoy…"
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, observaciones: e.target.value }))
                    }
                  />
                </div>
              </div>
            )}

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
                {saving ? "Guardando…" : isLastGroup ? "Guardar reporte" : "Siguiente"}
              </button>
            </div>

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
 * Componentes UI simples
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
            value === true
              ? "bg-emerald-600 text-white"
              : "bg-slate-50 border border-slate-200 text-slate-800"
          }`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 rounded-2xl px-4 py-3 font-black ${
            value === false
              ? "bg-rose-600 text-white"
              : "bg-slate-50 border border-slate-200 text-slate-800"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}