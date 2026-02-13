"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CuidadorLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push("/cuidador");
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/hero_background.png"
                    alt="Acompañamiento Red Viva"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent"></div>
            </div>

            <div className="w-full max-w-md glass-card-dark p-10 rounded-[2.5rem] border border-white/10 relative z-10 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <img src="/red-viva-logo.png" alt="Red Viva" className="brand-logo" />
                    </div>
                    <h1 className="text-4xl font-outfit font-black mb-2 text-white uppercase tracking-tighter">Red Viva</h1>
                    <p className="text-slate-400 text-sm font-medium">Acceso para Cuidadores y Auxiliares</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-4">Email</label>
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary transition-all text-white placeholder:text-slate-600"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-4">Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary transition-all text-white placeholder:text-slate-600"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 text-white disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? "Iniciando sesión..." : "Ingresar"}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-white/5 pt-8">
                    <Link href="/" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <span className="material-symbols-rounded text-sm">arrow_back</span>
                        Volver al inicio
                    </Link>
                </div>

                <p className="text-center text-[10px] text-slate-600 mt-10 uppercase tracking-widest font-bold">
                    Sistema de Cuidado Ético • v2.0
                </p>
            </div>
        </div>
    );
}
