"use client";

import Link from "next/link";

export default function HomeRedViva() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-6">
      <div className="max-w-3xl w-full text-center bg-white rounded-3xl shadow-xl p-10">

        {/* LOGO */}
        <div className="flex items-center mb-6">
  <img
    src="/red-viva-logo.png"
    alt="Red Viva"
    className="h-36 w-auto"
  />
</div>

        {/* TITULO */}
       <h1 className="text-4xl font-extrabold text-blue-900 mb-3">
  Red Viva
</h1>

<p className="text-slate-700 mb-4 text-lg">
  Sistema de apoyo al cuidado y seguimiento de personas mayores
</p>

<p className="text-slate-500 text-sm">
  Red Viva conecta el reporte diario de cuidadores con la revisión profesional,
  integrando tecnología de apoyo y criterios éticos para una atención responsable.
</p>

        {/* ACCESOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

          {/* CUIDADOR */}
          <Link
            href="/reporte-cuidador"
            className="block border rounded-2xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              👩‍⚕️ Reporte Diario del Cuidador
            </h2>
            <p className="text-sm text-slate-600">
              Espacio para registrar observaciones diarias sobre el estado del adulto mayor.
  No requiere lenguaje técnico ni toma de decisiones.
            </p>
          </Link>

          {/* PROFESIONAL */}
          <Link
            href="/dashboard-profesional"
            className="block border rounded-2xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              🧑‍⚕️ Dashboard Profesional
            </h2>
            <p className="text-sm text-slate-600">
              Espacio para la revisión de casos, validación profesional interdisciplinaria
  y registro de actuaciones con trazabilidad.
            </p>
          </Link>
        </div>

        {/* PIE */}
        <p className="mt-10 text-xs text-slate-400">
          La información es gestionada según el rol del usuario.
  La tecnología no reemplaza el criterio humano..
        </p>

      </div>
    </main>
  );
}
