"use client";

import ProfesionalLayout from "@/components/ProfesionalLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { profesionalService, UsuarioProfesional } from "@/lib/profesionalService";

export default function AlertasPage() {
    const [alertas, setAlertas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const profile = await profesionalService.getPerfil(session.user.id);
                const { data } = await supabase
                    .from('alertas')
                    .select('*, adultos_mayores(nombre)')
                    .eq('rol_asignado', profile.rol)
                    .order('recibido_at', { ascending: false });
                setAlertas(data || []);
            }
            setLoading(false);
        };
        load();
    }, []);

    return (
        <ProfesionalLayout>
            <div className="p-10 space-y-8">
                <header>
                    <h1 className="text-3xl font-black font-outfit text-slate-800 uppercase">Gestión de Alertas</h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Cola de atención prioritaria</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {alertas.map(alerta => (
                        <div key={alerta.id} className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] hover:border-primary transition-all shadow-sm">
                            <p className="text-[10px] font-black text-red-500 uppercase mb-4">{alerta.tipo}</p>
                            <h3 className="text-xl font-black mb-2">{alerta.adultos_mayores?.nombre}</h3>
                            <p className="text-sm text-slate-600 mb-6">{alerta.descripcion}</p>
                            <div className="flex justify-between items-center pt-6 border-t">
                                <span className="text-[10px] font-black text-slate-400 uppercase">{alerta.estado}</span>
                                <button className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Atender</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ProfesionalLayout>
    );
}
