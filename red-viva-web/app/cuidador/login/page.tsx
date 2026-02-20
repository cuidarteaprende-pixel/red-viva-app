"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function CuidadorLoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Mock login
            await new Promise(r => setTimeout(r, 1000));
            toast.success("Bienvenido al Portal Cuidador");
            router.push("/cuidador");
        } catch (err) {
            toast.error("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const handleRecovery = () => {
        if (!email) {
            toast.error("Ingresa tu correo para recuperar el acceso");
            return;
        }
        toast.success("Te enviaremos un enlace de acceso seguro.");
    };

    return (
        <div className="w-full max-w-md space-y-8">
            <header className="flex flex-col items-center text-center space-y-6">
                <Link
                    href="/"
                    className="self-start inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Link>
                <div className="w-20 h-20 bg-rose-500 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-rose-200">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portal Cuidador</h1>
                    <p className="text-slate-500 font-medium">Ingresa para registrar tu reporte del día.</p>
                </div>
            </header>

            <form onSubmit={handleLogin} className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Correo Electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-rose-500/5 transition-all"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Contraseña (opcional para OTP)</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="password"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-rose-500/5 transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="text-right px-2">
                        <button
                            type="button"
                            onClick={handleRecovery}
                            className="text-[10px] font-black uppercase text-rose-500 hover:underline"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-premium bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-200 py-5"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "ACCESO SEGURO"}
                </button>
            </form>

            <footer className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                Cuidado Ético & Transparente <br />
                <span className="text-slate-900">WCAG AA Compliant</span>
            </footer>
        </div>
    );
}

export default function CuidadorLoginPage() {
    return (
        <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-6 selection:bg-rose-100">
            <Suspense fallback={<Loader2 className="animate-spin text-rose-500" />}>
                <CuidadorLoginForm />
            </Suspense>
        </div>
    );
}
