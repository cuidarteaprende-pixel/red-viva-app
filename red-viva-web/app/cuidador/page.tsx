"use client";

import Link from "next/link";
import { Heart, AlertTriangle, ArrowRight, Lock } from "lucide-react";

export default function ReporteCuidadorPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(239,68,68,0.12),_transparent_55%)]" />
        <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] bg-white/40" />

        <div className="relative mx-auto max-w-5xl p-6 md:p-10 space-y-8">
          {/* Header */}
          <header className="rounded-[2.5rem] border border-slate-200/70 bg-white/75 backdrop-blur-md p-7 md:p-10 shadow-[0_20px_60px_rgba(2,6,23,0.06)]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                  Reporte del cuidador
                </h1>
                <p className="mt-2 text-slate-600 font-medium">
                  Desde aquí puedes diligenciar el reporte diario y registrar novedades.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-700 shadow-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Listo para registrar
              </div>
            </div>
          </header>

          {/* Cards */}
          <section className="grid gap-6 md:grid-cols-2">
            {/* Reporte diario (activo) */}
            <Link
              href="/care/report/daily"
              className="group relative rounded-[2.5rem] border border-slate-200/70 bg-white/75 backdrop-blur-md p-7 md:p-8 shadow-[0_18px_50px_rgba(2,6,23,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(2,6,23,0.10)] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400/30"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[2.5rem] bg-gradient-to-r from-emerald-500 to-emerald-600" />

              <div className="flex items-start justify-between gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                  <Heart className="w-7 h-7 text-emerald-600" />
                </div>

                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Prioridad diaria
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-900 tracking-tight">
                Reporte diario
              </h2>

              <p className="mt-2 text-slate-600 font-medium leading-relaxed">
                Registra el estado del adulto mayor (salud, rutina, cognición y entorno).
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition-all group-hover:gap-4 group-hover:bg-emerald-700">
                Ir al reporte
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl" />
            </Link>

            {/* Evento / novedad (próximamente - sin ruta) */}
            <div className="group relative rounded-[2.5rem] border border-slate-200/70 bg-white/60 backdrop-blur-md p-7 md:p-8 shadow-[0_18px_50px_rgba(2,6,23,0.05)]">
              <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[2.5rem] bg-gradient-to-r from-rose-500 to-rose-600" />

              {/* Badge Próximamente */}
              <div className="absolute right-6 top-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-700">
                <Lock className="w-3.5 h-3.5" />
                Próximamente
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-7 h-7 text-rose-600" />
                </div>

                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Urgente / evento
                </div>
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-900 tracking-tight">
                Evento / novedad
              </h2>

              <p className="mt-2 text-slate-600 font-medium leading-relaxed">
                Registra un evento puntual (caída, síntoma agudo, incidente, etc.).
              </p>

              {/* CTA deshabilitado visualmente */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-200 px-5 py-3 text-sm font-black text-slate-600 cursor-not-allowed">
                Registrar evento
                <ArrowRight className="w-4 h-4" />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                (Esta funcionalidad está en construcción para la siguiente versión.)
              </p>

              <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-rose-500/10 blur-2xl" />
            </div>
          </section>

          {/* Notas */}
          <section className="rounded-[2.5rem] border border-slate-200/70 bg-white/75 backdrop-blur-md p-7 md:p-8 shadow-[0_18px_50px_rgba(2,6,23,0.06)]">
            <h3 className="text-lg font-black text-slate-900">Notas</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600 font-medium">
              <li>
                Si estás en demo, usa el formulario diario y valida que se guarde en
                <span className="font-black"> reportes_cuidador</span>.
              </li>
              <li>
                Si Vercel vuelve a fallar, revisa el log: normalmente es ESLint por
                variables/imports no usados.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}