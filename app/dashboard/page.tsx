"use client";

import ProfesionalLayout from "@/components/ProfesionalLayout";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { profesionalService, UsuarioProfesional } from "@/lib/profesionalService";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [user, setUser] = useState<UsuarioProfesional | null>(null);
    const [alertas, setAlertas] = useState<any[]>([]);
    const [casos, setCasos] = useState<any[]>([]);
    const [kpis, setKpis] = useState({
        alertasNoAtendidas: 0,
        casosSeguimiento: 0,
        actuacionesRequeridas: 0,
        sla: "100%"
    });
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const profile = await profesionalService.getPerfil(session.user.id);
                setUser(profile);
                await fetchData(profile);
            }
        };
        load();
    }, []);

    const fetchData = async (perfil: UsuarioProfesional) => {
        const { data: alerts } = await supabase
            .from('alertas')
            .select('*, adultos_mayores(nombre)')
            .eq('rol_asignado', perfil.rol)
            .order('recibido_at', { ascending: false });

        const casesData = await profesionalService.getCasos();

        const noAtendidas = (alerts || []).filter(a => a.estado === 'nuevo').length;
        setAlertas(alerts || []);
        setCasos(casesData);
        setKpis({
            alertasNoAtendidas: noAtendidas,
            casosSeguimiento: casesData.length,
            actuacionesRequeridas: (alerts || []).filter(a => a.estado === 'acciones_en_curso').length,
            sla: "95%"
        });
    };

    return (
        <ProfesionalLayout>
            <div className="p-10 space-y-10">
                <header>
                    <h1 className="text-3xl font-black font-outfit text-slate-800 uppercase">Dashboard General</h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Resumen de operaciones para {user?.rol}</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div onClick={() => router.push('/alertas')} className="glass-card p-8 rounded-[2rem] border-l-8 border-l-red-500 cursor-pointer hover:shadow-xl transition-all">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Alertas No Atendidas</p>
                        <p className="text-4xl font-black text-red-600">{kpis.alertasNoAtendidas.toString().padStart(2, '0')}</p>
                    </div>
                    <div onClick={() => router.push('/casos-cas')} className="glass-card p-8 rounded-[2rem] border-l-8 border-l-primary cursor-pointer hover:shadow-xl transition-all">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Casos CAS</p>
                        <p className="text-4xl font-black text-slate-800">{kpis.casosSeguimiento.toString().padStart(2, '0')}</p>
                    </div>
                    <div className="glass-card p-8 rounded-[2rem] border-l-8 border-l-amber-500">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Actuaciones Requeridas</p>
                        <p className="text-4xl font-black text-amber-600">{kpis.actuacionesRequeridas.toString().padStart(2, '0')}</p>
                    </div>
                    <div className="glass-card p-8 rounded-[2rem] border-l-8 border-l-green-500">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">SLA</p>
                        <p className="text-4xl font-black text-green-600">{kpis.sla}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
                        <h3 className="text-lg font-black uppercase mb-6">Alertas Críticas</h3>
                        <div className="space-y-4">
                            {alertas.slice(0, 3).map(a => (
                                <div key={a.id} className="p-4 bg-slate-50 rounded-2xl border flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-bold">{a.adultos_mayores?.nombre}</p>
                                        <p className="text-[10px] text-slate-400">{a.descripcion}</p>
                                    </div>
                                    <span className="text-red-500 material-symbols-rounded">warning</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </ProfesionalLayout>
    );
}
