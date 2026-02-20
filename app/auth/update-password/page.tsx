"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setSuccess(true);
            toast.success("Contraseña actualizada correctamente.");

            setTimeout(() => {
                router.push("/auth/login?role=pro");
            }, 3000);
        } catch (err: any) {
            toast.error(err.message || "Error al actualizar la contraseña.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_40%)] from-primary/5">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-200 text-center space-y-6"
                    >
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-black font-display text-slate-900 tracking-tight">
                            ¡Contraseña Actualizada!
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">
                            Tu contraseña ha sido cambiada con éxito. Serás redirigido al inicio de sesión en unos segundos.
                        </p>
                        <Link
                            href="/auth/login?role=pro"
                            className="inline-block w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:bg-slate-900 transition-all"
                        >
                            Ir al Login ahora
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_40%)] from-primary/5">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-200"
                >
                    {/* Header */}
                    <header className="flex flex-col items-center text-center mb-8">
                        <Link
                            href="/gateway"
                            className="self-start mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4 rounded-lg interactive"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            Volver
                        </Link>

                        <img
                            src="/red-viva-logo.png"
                            alt="Red Viva Logo"
                            className="h-20 w-auto mb-6 drop-shadow-sm"
                        />

                        <h1 className="text-2xl font-black font-display text-slate-900 tracking-tight">
                            Nueva Contraseña
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-2">
                            Establezca su nueva contraseña de acceso.
                        </p>
                    </header>

                    {/* Form */}
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                                Nueva Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" aria-hidden="true" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" aria-hidden="true" />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-primary/20 flex items-center justify-center gap-3 btn-premium"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                "Actualizar Contraseña"
                            )}
                        </button>
                    </form>

                    <footer className="text-center text-[10px] text-slate-400 mt-10 uppercase tracking-[0.2em] leading-relaxed">
                        Seguridad & Trazabilidad <br />
                        <span className="font-black text-slate-900">RED VIVA AI</span>
                    </footer>
                </motion.div>
            </div>
        </div>
    );
}
