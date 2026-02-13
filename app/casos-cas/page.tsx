"use client";

import ProfesionalLayout from "@/components/ProfesionalLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { profesionalService } from "@/lib/profesionalService";

export default function CasosPage() {
    const [casos, setCasos] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await profesionalService.getCasos();
            setCasos(data);
        };
        load();
    }, []);

    return (
        <ProfesionalLayout>
            <div className="p-10 space-y-8">
                <header>
                    <h1 className="text-3xl font-black font-outfit text-slate-800 uppercase">Casos Interdisciplinarios (CAS)</h1>
                </header>

                <div className="bg-white rounded-[3rem] border shadow-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-white text-[10px] font-black uppercase">
                            <tr>
                                <th className="px-10 py-6">Persona</th>
                                <th className="px-10 py-6">Estado</th>
                                <th className="px-10 py-6">Prioridad</th>
                                <th className="px-10 py-6">Único ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {casos.map(c => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="px-10 py-6 font-bold">{c.adultos_mayores?.nombre}</td>
                                    <td className="px-10 py-6 uppercase text-[10px] font-black text-primary">{c.estado}</td>
                                    <td className="px-10 py-6 text-xs uppercase font-bold">{c.prioridad}</td>
                                    <td className="px-10 py-6 font-mono text-[10px] text-slate-400">#CAS-{c.id.split('-')[0]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ProfesionalLayout>
    );
}
