"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/* ========= TIPOS (usa los tuyos si ya existen) ========= */
type RolProfesional =
  | "Gerontología"
  | "Psicología"
  | "Fisioterapia"
  | "Enfermería"
  | "Trabajo Social";

type Caso = {
  id: number;
  nombre: string;
  edad: number;
  programa: string;
  estado: string;
};

type Actuacion = {
  id: number;
  fecha: string;
  rol: string;
  descripcion: string;
};

/* ========= COMPONENTE ========= */
export default function DashboardProfesional() {
  /* ---------- ESTADOS ---------- */
  const [rolActivo, setRolActivo] = useState<RolProfesional>("Gerontología");

  const [casos, setCasos] = useState<Caso[]>([]);
  const [casoSeleccionado, setCasoSeleccionado] = useState<Caso | null>(null);

  const [actuaciones, setActuaciones] = useState<Actuacion[]>([]);
  const [textoActuacion, setTextoActuacion] = useState("");

  const [reportes, setReportes] = useState<any[]>([]);

  /* ---------- EFECTO: LEER REPORTES DESDE SUPABASE ---------- */
  useEffect(() => {
    const fetchReportes = async () => {
      const { data, error } = await supabase
        .from("reportes_cuidador")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error cargando reportes:", error);
      } else {
        console.log("✅ Reportes desde Supabase:", data);
        setReportes(data || []);
      }
    };

    fetchReportes();
  }, []);

  /* ---------- FUNCIONES AUXILIARES (mock / existentes) ---------- */
  const iconoEstado = (estado: string) => {
    if (estado === "alerta") return "⚠️";
    if (estado === "estable") return "✅";
    return "ℹ️";
  };

  const generarResumenIA = (caso: Caso) => {
    return `Resumen automático del caso de ${caso.nombre}.`;
  };

  const registrarActuacion = () => {
    if (!textoActuacion || !casoSeleccionado) return;

    const nueva: Actuacion = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      rol: rolActivo,
      descripcion: textoActuacion,
    };

    setActuaciones((prev) => [...prev, nueva]);
    setTextoActuacion("");
  };

  const actuacionesDelCaso = actuaciones;

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <main className="grid grid-cols-12 gap-6">

        {/* LISTA DE ADULTOS MAYORES */}
        <section className="col-span-3 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-slate-700 mb-4">
            Adultos Mayores
          </h2>

          <ul className="space-y-2 text-sm">
            {casos.map((caso) => (
              <li
                key={caso.id}
                onClick={() => setCasoSeleccionado(caso)}
                className={`p-2 rounded-lg cursor-pointer ${casoSeleccionado?.id === caso.id
                    ? "bg-blue-100"
                    : "hover:bg-slate-100"
                  }`}
              >
                {iconoEstado(caso.estado)} {caso.nombre}
              </li>
            ))}
          </ul>
        </section>

        {/* DETALLE DEL CASO */}
        <section className="col-span-6 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-slate-700 mb-4">
            Detalle del caso
          </h2>

          {!casoSeleccionado ? (
            <p className="text-sm text-slate-500">
              Selecciona un adulto mayor para ver la información.
            </p>
          ) : (
            <div className="space-y-3 text-sm">

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <p><strong>Nombre:</strong> {casoSeleccionado.nombre}</p>
                <p><strong>Edad:</strong> {casoSeleccionado.edad} años</p>
                <p><strong>Programa:</strong> {casoSeleccionado.programa}</p>
              </div>

              <div className="mt-6 bg-slate-50 border rounded-xl p-4">
                <h3 className="font-semibold text-slate-700 mb-2">
                  Resumen generado por IA
                </h3>

                <p className="text-sm text-slate-700">
                  {generarResumenIA(casoSeleccionado)}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">
                  Registro de actuación
                </h3>

                <textarea
                  value={textoActuacion}
                  onChange={(e) => setTextoActuacion(e.target.value)}
                  className="w-full border rounded-lg p-2 text-sm"
                  placeholder="Describe la actuación realizada..."
                />

                <button
                  onClick={registrarActuacion}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Guardar actuación
                </button>
              </div>
            </div>
          )}
        </section>

        {/* BITÁCORA */}
        <section className="col-span-3 bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-slate-700 mb-4">Bitácora</h2>

          {!casoSeleccionado ? (
            <p className="text-sm text-slate-500">Selecciona un caso.</p>
          ) : actuacionesDelCaso.length === 0 ? (
            <p className="text-sm text-slate-500">
              No hay actuaciones registradas.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {actuacionesDelCaso.map((a) => (
                <li
                  key={a.id}
                  className="pl-3 py-2 rounded-lg border-l-4 border-blue-600"
                >
                  <p className="text-xs text-slate-500">{a.fecha}</p>
                  <p className="font-semibold">{a.rol}</p>
                  <p>{a.descripcion}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
