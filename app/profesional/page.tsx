"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { profesionalService, UsuarioProfesional } from "@/lib/profesionalService";

export default function ProfesionalPortal() {
    const router = useRouter();
    const [user, setUser] = useState<UsuarioProfesional | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            try {
                const profile = await profesionalService.getPerfil(session.user.id);
                setUser(profile);
                router.push('/dashboard');
            } catch (err) {
                console.error("No se encontró perfil profesional", err);
            }
        }
        setLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setLoginError(null);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setLoginError(error.message);
                throw error;
            }
            if (data.user) {
                const profile = await profesionalService.getPerfil(data.user.id);
                setUser(profile);
                profesionalService.registrarAuditoria({
                    actor_usuario_id: profile.id,
                    rol_actor: profile.rol,
                    institucion_actor: profile.institucion,
                    accion: 'LOGIN',
                    entidad: 'auth'
                });
                router.push('/dashboard');
            }
        } catch (err) {
            console.error("Login component error", err);
        } finally {
            setAuthLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src="/hero_background.png" alt="Red Viva" className="w-full h-full object-cover opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]"></div>
            </div>
            <div className="w-full max-w-md glass-card-dark p-12 rounded-[3rem] border border-white/10 relative z-10 shadow-2xl">
                <div className="text-center mb-10">
                    <img src="/red-viva-logo.png" alt="Red Viva" className="brand-logo mx-auto mb-6" />
                    <h1 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter">Portal Profesional</h1>
                    <p className="text-slate-400 text-sm mt-2 font-bold">Acceso seguro interdisciplinario</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Institucional</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-primary transition-all font-bold" placeholder="nombre@redviva.test" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Clave de Seguridad</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-primary transition-all font-bold" placeholder="••••••••" required />
                    </div>
                    {loginError && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs text-center font-black animate-pulse">
                            {loginError}
                        </div>
                    )}
                    <button disabled={authLoading} className="w-full bg-primary py-5 rounded-3xl font-black text-sm uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-6 disabled:opacity-50">
                        {authLoading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
}
