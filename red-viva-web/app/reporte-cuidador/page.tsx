export default function ReporteCuidadorPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Reporte del cuidador</h1>
          <p className="mt-2 text-sm text-slate-600">
            Acceso rápido al formulario de reporte diario.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <a
            href="/care/report/daily"
            className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
          >
            Ir a Reporte diario
          </a>
        </section>
      </div>
    </main>
  );
}