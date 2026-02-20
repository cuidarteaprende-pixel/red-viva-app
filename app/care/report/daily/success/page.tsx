"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DailySuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 selection:bg-emerald-100">
            <div className="w-full max-w-sm text-center space-y-8">
                {/* Success Icon */}
                <div className="relative inline-block">
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30"
                    >
                        <CheckCircle2 className="w-12 h-12" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-white"
                    >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    </motion.div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-display font-black text-slate-900 tracking-tight"
                    >
                        ¡Reporte Enviado!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 font-medium text-lg leading-relaxed px-4"
                    >
                        Tus respuestas han sido guardadas de forma segura y están listas para la revisión profesional.
                    </motion.p>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-3 pt-4"
                >
                    <Link
                        href="/care/home"
                        className="w-full bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 px-8 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                    >
                        <Home className="w-4 h-4" />
                        Volver al Inicio
                    </Link>

                    <Link
                        href="/care/home" // Could be history in future
                        className="w-full bg-white text-slate-500 font-bold text-sm py-4 rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-all"
                    >
                        Ver mis reportes
                    </Link>
                </motion.div>

                {/* WCAG Compliance Tag */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 pt-8"
                >
                    Cuidado Ético · WCAG AA COMPLIANT
                </motion.p>
            </div>
        </div>
    );
}
