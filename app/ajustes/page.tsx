"use client";

import ProfesionalLayout from "@/components/ProfesionalLayout";

export default function AjustesPage() {
    return (
        <ProfesionalLayout>
            <div className="p-10 space-y-8">
                <header>
                    <h1 className="text-3xl font-black font-outfit text-slate-800 uppercase">Configuración del Perfil</h1>
                </header>
                <div className="bg-white p-10 rounded-[3rem] border shadow-sm max-w-2xl">
                    <p className="text-slate-400 font-bold uppercase text-xs mb-8">Información Institucional</p>
                    <div className="space-y-6">
                        <div className="h-4 w-full bg-slate-100 rounded-full animate-pulse"></div>
                        <div className="h-4 w-2/3 bg-slate-100 rounded-full animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-slate-100 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </ProfesionalLayout>
    );
}
