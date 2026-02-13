"use client";

import ProfesionalLayout from "@/components/ProfesionalLayout";

export default function ReportesPage() {
    return (
        <ProfesionalLayout>
            <div className="p-10 space-y-8">
                <header>
                    <h1 className="text-3xl font-black font-outfit text-slate-800 uppercase">Reportes y Estadísticas</h1>
                </header>
                <div className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                    <span className="material-symbols-rounded text-6xl text-slate-200 mb-4">analytics</span>
                    <h3 className="text-xl font-black text-slate-400 uppercase">Módulo de IA en Validación</h3>
                    <p className="text-sm text-slate-400 mt-2">Los reportes agregados estarán disponibles tras la consolidación de la red.</p>
                </div>
            </div>
        </ProfesionalLayout>
    );
}
