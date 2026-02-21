"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

/**
 * Config
 */
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

/**
 * Tipos
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

type StepGroup = {
  title: string;
  subtitle: string;
  keys: StepKey[];
};

type FormData = {
  fechaHora: string; // ISO local string
  respuestas: Respuestas;
  notaCorta: string;
  observaciones: string;
};

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

/**
 * UI helpers
 */
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
  const [caregiverId, setCaregiverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Debug visible (clave para no adivinar)
  const [debugMsg, setDebugMsg] = useState<string>("");

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

  /**
   * Carga IDs (sesión o demo)
   */
  useEffect(() => {
    async function loadSessionAndIds() {
      setDebugMsg("");
      try {
        const {
          data: { session },
          error: sessErr,
        } = await supabase.auth.getSession();

        if (sessErr) {
          console.warn("Error getSession:", sessErr);
        }

        // A) CON sesión: mapear cuidador por auth_user_id
        if (session) {
          setDebugMsg(`✅ Sesión detectada: ${session.user.email ?? session.user.id}`);

          const { data: cg, error: cgErr } = await supabase
            .from("cuidadores")
            .select("id")
            .eq("auth_user_id", session.user.id)
            .maybeSingle();

          if (cgErr) {
            console.warn("Error buscando cuidador por sesión:", cgErr);
            setDebugMsg(
              (prev) =>
                prev + `\n⚠️ No pude mapear cuidador por auth_user_id: ${cgErr.message}`
            );
          }

          if (cg?.id) {
            setCaregiverId(cg.id);
            setDebugMsg((prev) => prev + `\n✅ cuidador_id: ${cg.id}`);

            const { data: assignments, error: asgErr } = await supabase
              .from("asignaciones_cuidado")
              .select("adulto_id")
              .eq("cuidador_id", cg.id)
              .limit(1);

            if (asgErr) {
              console.warn("Error buscando asignación:", asgErr);
              setDebugMsg((prev) => prev + `\n⚠️ Error asignación: ${asgErr.message}`);
            }

            if (assignments?.length) {
              setAdultoId(assignments[0].adulto_id);
              setDebugMsg((prev) => prev + `\n✅ adulto_id (asignado): ${assignments[0].adulto_id}`);
            } else {
              setDebugMsg(
                (prev) =>
                  prev +
                  `\n⚠️ No encontré asignaciones_cuidado para este cuidador (adulto_id queda vacío).`
              );
            }
          } else {
            setDebugMsg(
              (prev) =>
                prev +
                `\n❌ No encontré cuidador asociado a este usuario (tabla cuidadores.auth_user_id).`
            );
          }
        }

        // B) SIN sesión + DEMO: usar primer cuidador + primer adulto
        if (!session && DEMO_MODE) {
          setDebugMsg("🟡 DEMO_MODE activo: NO hay sesión. Tomando primer cuidador y primer adulto.");

          const { data: fallbackCg, error: fcgErr } = await supabase
            .from("cuidadores")
            .select("id")
            .order("id", { ascending: true })
            .limit(1)
            .maybeSingle();

          const { data: fallbackAm, error: famErr } = await supabase
            .from("adultos_mayores")
            .select("id")
            .order("id", { ascending: true })
            .limit(1)
            .maybeSingle();

          if (fcgErr) setDebugMsg((prev) => prev + `\n⚠️ DEMO cuidadores error: ${fcgErr.message}`);
          if (famErr) setDebugMsg((prev) => prev + `\n⚠️ DEMO adultos error: ${famErr.message}`);

          if (fallbackCg?.id) {
            setCaregiverId(fallbackCg.id);
            setDebugMsg((prev) => prev + `\n✅ DEMO cuidador_id: ${fallbackCg.id}`);
          } else {
            setDebugMsg((prev) => prev + `\n❌ DEMO: no hay cuidadores en la tabla.`);
          }

          if (fallbackAm?.id) {
            setAdultoId(fallbackAm.id);
            setDebugMsg((prev) => prev + `\n✅ DEMO adulto_id: ${fallbackAm.id}`);
          } else {
            setDebugMsg((prev) => prev + `\n❌ DEMO: no hay adultos_mayores en la tabla.`);
          }

          toast.info("Modo Demo activo", {
            description: "Sin sesión. Se usarán perfiles de prueba.",
          });
        }

        // C) SIN sesión y NO demo
        if (!session && !DEMO_MODE) {
          toast.error("Sesión no detectada", {
            description: "Debes iniciar sesión para enviar el reporte.",
          });
          setDebugMsg("❌ No hay sesión. Inicia sesión o activa DEMO_MODE.");
        }
      } catch (e: any) {
        console.error("loadSessionAndIds error:", e);
        setDebugMsg(`❌ Error inesperado en loadSessionAndIds: ${e?.message ?? String(e)}`);
      } finally {
        setLoading(false);
      }
    }

    loadSessionAndIds();
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

  /**
   * Inserta con fallback por esquema + errores explícitos
   */
  async function insertWithFallback(payload: any) {
    // 1) Intento estándar (respuestas jsonb)
    try {
      const res = await supabase
        .from("reportes_cuidador")
        .insert(payload)
        .select()
        .throwOnError();

      return { data: res.data, error: null };
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      console.warn("[Insert estándar falló]", e);

      // Solo hacemos fallback si parece ser por columna inexistente
      const looksLikeMissingColumn =
        msg.toLowerCase().includes("column") && msg.toLowerCase().includes("does not exist");

      if (!looksLikeMissingColumn) {
        return { data: null, error: { message: msg } };
      }

      // 2) Fallback: guardar en contenido/notas (texto)
      const fallbackPayload: any = {
        adulto_id: payload.adulto_id,
        cuidador_id: payload.cuidador_id,
        tipo_reporte: payload.tipo_reporte ?? "diario",
        fecha: payload.fecha,
        contenido: JSON.stringify(payload.respuestas ?? {}),
        notas: payload.notas ?? null,
      };

      try {
        const res2 = await supabase
          .from("reportes_cuidador")
          .insert(fallbackPayload)
          .select()
          .throwOnError();

        return { data: res2.data, error: null };
      } catch (e2: any) {
        const msg2 = String(e2?.message ?? e2);
        console.warn("[Insert fallback falló]", e2);
        return { data: null, error: { message: msg2 } };
      }
    }
  }

  const handleSubmit = async () => {
    setDebugMsg((prev) => prev + "\n\n🟣 Intentando guardar reporte…");
    console.log("click guardar reporte", { adultoId, caregiverId, DEMO_MODE });

    if (!adultoId || !caregiverId) {
      toast.error("No se puede guardar el reporte", {
        description:
          "Falta identificar el cuidador o el adulto. Revisa debug abajo (asignación / sesión / demo).",
      });
      setDebugMsg(
        (prev) =>
          prev +
          `\n❌ No puedo guardar: adultoId=${adultoId ?? "null"} caregiverId=${
            caregiverId ?? "null"
          }`
      );
      return;
    }

    setSaving(true);

    try {
      const fechaISO = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const notasFinal =
        `Nota corta: ${formData.notaCorta || "—"}\n` +
        `Observaciones: ${formData.observaciones || "—"}`;

      const payload = {
        adulto_id: adultoId,
        cuidador_id: caregiverId,
        tipo_reporte: "diario",
        fecha: fechaISO,
        respuestas: formData.respuestas,
        notas: notasFinal,
      };

      setDebugMsg((prev) => prev + `\n📦 Payload listo (fecha=${fechaISO})`);

      const result = await insertWithFallback(payload);

      if (result.error) {
        toast.error("No se pudo guardar el reporte", {
          description: result.error.message,
        });
        setDebugMsg((prev) => prev + `\n❌ INSERT ERROR: ${result.error.message}`);
        return;
      }

      setDebugMsg((prev) => prev + `\n✅ Guardado OK. Filas insertadas: ${result.data?.length ?? 0}`);

      // Buscar nombre para success
      const { data: adultoRow, error: adultoErr } = await supabase
        .from("adultos_mayores")
        .select("nombre")
        .eq("id", adultoId)
        .maybeSingle();

      if (adultoErr) {
        console.warn("No pude leer nombre del adulto:", adultoErr);
        setDebugMsg((prev) => prev + `\n⚠️ No pude leer nombre del adulto: ${adultoErr.message}`);
      }

      const adultoNombre = adultoRow?.nombre ?? "";
      toast.success("Reporte guardado", { description: "Redirigiendo a confirmación…" });

      router.push(
        `/care/report/daily/success?adulto=${encodeURIComponent(adultoNombre)}`
      );
    } catch (e: any) {
      console.error("Unexpected error:", e);
      toast.error("Error inesperado al guardar el reporte", {
        description: e?.message ?? "Revisa consola",
      });
      setDebugMsg((prev) => prev + `\n❌ ERROR inesperado: ${e?.message ?? String(e)}`);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Render de secciones por StepKey
   */
  const renderFields = (k: StepKey) => {
    const v = (field: string) => (formData.respuestas[k] as any)?.[field];
    const set = (field: string, value: unknown) => updateStepData(k, field, value);

    switch (k) {
      case "salud_fisica":
        return (
          <SectionCard title="Salud física y signos" subtitle="Dolor, fiebre, respiración, energía">
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
          </SectionCard>
        );

      case "movilidad":
        return (
          <SectionCard title="Movilidad y riesgo de caídas" subtitle="Marcha, equilibrio, caídas o casi caídas">
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
          </SectionCard>
        );

      case "nutricion":
        return (
          <SectionCard title="Nutrición e hidratación" subtitle="Comidas, líquidos, evacuación y señales">
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
          </SectionCard>
        );

      case "medicacion":
        return (
          <SectionCard title="Medicación" subtitle="Adherencia, olvidos y efectos">
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
          </SectionCard>
        );

      case "higiene_piel":
        return (
          <SectionCard title="Higiene, piel e incontinencia" subtitle="Integridad de piel, lesiones y cuidado">
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
            <YesNo
              label="¿Hay incontinencia hoy?"
              value={(v("incontinencia") as boolean | undefined) ?? null}
              onChange={(val) => set("incontinencia", val)}
            />
            <YesNo
              label="¿Hubo cambio de pañal/ropa a tiempo?"
              value={(v("cambio_panal") as boolean | undefined) ?? null}
              onChange={(val) => set("cambio_panal", val)}
            />
            <Input
              label="Zonas afectadas (si aplica)"
              value={(v("zonas") as string | undefined) ?? ""}
              onChange={(val) => set("zonas", val)}
              placeholder="Ej: sacro, talones, caderas…"
            />
            <Input
              label="Observaciones (opcional)"
              value={(v("observaciones_piel") as string | undefined) ?? ""}
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
              value={(v("calidad") as string | undefined) ?? ""}
              onChange={(val) => set("calidad", val)}
              options={["Buena", "Regular", "Mala"]}
            />
            <YesNo
              label="¿Se despertó varias veces?"
              value={(v("despertares") as boolean | undefined) ?? null}
              onChange={(val) => set("despertares", val)}
            />
            <Select
              label="Siestas"
              value={(v("siestas") as string | undefined) ?? ""}
              onChange={(val) => set("siestas", val)}
              options={["No", "Sí, corta", "Sí, larga"]}
            />
            <Input
              label="Horas aproximadas dormidas (opcional)"
              value={(v("horas") as string | undefined) ?? ""}
              onChange={(val) => set("horas", val)}
              placeholder="Ej: 6.5"
            />
            <Input
              label="Observaciones (opcional)"
              value={(v("observaciones_sueno") as string | undefined) ?? ""}
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
              value={(v("animo") as string | undefined) ?? ""}
              onChange={(val) => set("animo", val)}
              options={["🙂 Bien", "😐 Neutro", "😟 Triste", "😠 Irritable", "😰 Ansioso"]}
            />
            <YesNo
              label="¿Hubo confusión o desorientación?"
              value={(v("confusion") as boolean | undefined) ?? null}
              onChange={(val) => set("confusion", val)}
            />
            <Select
              label="Interacción / comunicación"
              value={(v("interaccion") as string | undefined) ?? ""}
              onChange={(val) => set("interaccion", val)}
              options={["Normal", "Más callado", "Agitado", "No quiso hablar"]}
            />
            {/* AQUÍ QUEDAN Ansiedad y Estrés con escala clara */}
            <Select
              label="Ansiedad (1–5)"
              value={(v("ansiedad") as string | undefined) ?? ""}
              onChange={(val) => set("ansiedad", val)}
              options={SCALE_1_5}
            />
            <Select
              label="Estrés (1–5)"
              value={(v("estres") as string | undefined) ?? ""}
              onChange={(val) => set("estres", val)}
              options={SCALE_1_5}
            />
            <Input
              label="Cambios importantes (opcional)"
              value={(v("cambios") as string | undefined) ?? ""}
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
              value={(v("entorno") as string | undefined) ?? ""}
              onChange={(val) => set("entorno", val)}
              options={["Seguro", "Con riesgos (alfombras, escalones…)", "No evaluado"]}
            />
            <YesNo
              label="¿Hubo algún incidente en casa hoy?"
              value={(v("incidente") as boolean | undefined) ?? null}
              onChange={(val) => set("incidente", val)}
            />
            <Select
              label="Carga del cuidador"
              value={(v("carga") as string | undefined) ?? ""}
              onChange={(val) => set("carga", val)}
              options={SCALE_1_5}
            />
            <Input
              label="Nota final del cuidador (opcional)"
              value={(v("nota") as string | undefined) ?? ""}
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
            <p className="text-sm text-slate-500 mt-2">
              Verificando sesión / demo / asignación.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Reporte diario</h1>
          <p className="text-sm text-slate-600 mt-1">
            Completa el reporte en 3 pasos. Al final podrás agregar nota y observaciones.
          </p>

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

        {/* Grupo */}
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
                  onChange={(val) => setFormData((prev) => ({ ...prev, notaCorta: val }))}
                  placeholder="Ej: hoy estuvo más cansado de lo normal…"
                />
                <Textarea
                  label="Observaciones (opcional)"
                  value={formData.observaciones}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, observaciones: val }))
                  }
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
              {groupIndex < stepGroups.length - 1
                ? "Siguiente"
                : saving
                ? "Guardando…"
                : "Guardar reporte"}
            </button>
          </div>

          {/* DEBUG: esto te dirá EXACTAMENTE por qué no guarda */}
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700 mb-2">DEBUG (no se sube a producción si no quieres)</p>
            <pre className="text-xs text-slate-700 whitespace-pre-wrap">
{`DEMO_MODE: ${DEMO_MODE}
adultoId: ${adultoId ?? "null"}
caregiverId: ${caregiverId ?? "null"}

${debugMsg || "(sin debug aún)"}
`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Componentes UI (locales)
------------------------- */

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