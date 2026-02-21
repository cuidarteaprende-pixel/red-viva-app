"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function DailyReportSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const adulto = params.get("adulto")?.trim();
  const target = adulto ? `de ${adulto}` : "de la persona a tu cargo";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">¡Gracias!</h1>

        <p className="mt-3 text-slate-700 leading-relaxed">
          Tu información es muy importante para el cuidado {target} y para apoyarte en tu labor diaria.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => router.push("/cuidador")}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-black text-white shadow-sm"
          >
            Volver al portal
          </button>

          <button
            type="button"
            onClick={() => router.push("/care/report/daily")}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 font-black text-slate-800"
          >
            Registrar otro reporte
          </button>
        </div>
      </div>
    </div>
  );
}