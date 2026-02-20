"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Home, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SuccessPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-emerald-100 border border-emerald-50 max-w-sm w-full space-y-8"
            >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">¡Reporte Enviado!</h1>
                    <p className="text-slate-500 font-medium">La información ha sido guardada y está disponible para el equipo profesional.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={() => router.push("/cuidador")}
                        className="flex items-center justify-center gap-3 bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 transition-transform active:scale-95"
                    >
                        <Home className="w-5 h-5" />
                        VOLVER AL PORTAL
                    </button>

                    <button
                        onClick={() => router.push("/reporte-cuidador?tab=evento")}
                        className="flex items-center justify-center gap-3 bg-white border border-slate-100 text-slate-600 font-black py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                    >
                        NOTIFICAR EVENTO CRÍTICO
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Red Viva System • v2.0</p>
            </motion.div>
        </div>
    );
}
