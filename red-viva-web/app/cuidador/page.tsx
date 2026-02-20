/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
    Heart,
    History,
    Settings,
    LogOut,
    ChevronRight,
    Calendar,
    AlertCircle,
    Clock,
    User,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CuidadorPage() {
    return (
        <div className="min-h-screen bg-[#F0F7FF] flex flex-col selection:bg-rose-100 relative overflow-hidden">
            {/* Background Decorative Image */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <img
                    src="https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg?auto=compress&cs=tinysrgb&w=1920"
                    alt="Decorative care"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Top Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-6 sticky top-0 z-30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900 leading-none mb-1">Red Viva</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portal Cuidador</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <p className="text-xs font-black text-slate-900">Marta Rodríguez</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Cuidadora Auxiliar</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-rose-50 border-2 border-white shadow-sm flex items-center justify-center text-rose-500 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marta" alt="Marta" />
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-10">

                {/* Welcome Section */}
                <section className="space-y-2">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hola, Marta</h1>
                    <p className="text-slate-500 font-medium">¿Cómo se encuentra hoy la persona a tu cargo?</p>
                </section>

                {/* Quick Actions */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href="/care/report/daily"
                        className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-all overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Nuevo Reporte</h2>
                            <p className="text-slate-500 font-medium mb-6">Completa el seguimiento 360° del estado de salud diario.</p>
                            <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-600 group-hover:gap-4 transition-all">
                                Registrar Ahora <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Calendar className="w-24 h-24 text-slate-900" />
                        </div>
                    </Link>

                    <Link
                        href="/reporte-cuidador?tab=evento"
                        className="group relative bg-white p-10 rounded-[2.5rem] border border-rose-50 shadow-xl shadow-rose-200/20 hover:scale-[1.02] transition-all overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Reportar Evento</h2>
                            <p className="text-slate-500 font-medium mb-6">Informa caídas, novedades médicas o cambios urgentes.</p>
                            <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-rose-600 group-hover:gap-4 transition-all">
                                Registrar Alerta <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <AlertCircle className="w-24 h-24 text-rose-900" />
                        </div>
                    </Link>
                </section>

                {/* Recent History */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Tus Últimos Registros</h3>
                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary">Ver historial completo</button>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden divide-y divide-slate-50">
                        <HistoryItem
                            title="Reporte Diario"
                            time="Hoy, 08:30 AM"
                            status="Completado"
                            color="emerald"
                        />
                        <HistoryItem
                            title="Reporte Diario"
                            time="Ayer, 08:15 AM"
                            status="Completado"
                            color="emerald"
                        />
                        <HistoryItem
                            title="Evento: Cambio de Conducta"
                            time="12 Feb, 04:20 PM"
                            status="Visto por Profesional"
                            color="blue"
                        />
                    </div>
                </section>

                {/* Footer Actions */}
                <section className="flex flex-col md:flex-row gap-4 pt-10 border-t border-white">
                    <button className="flex-1 py-4 px-8 rounded-2xl bg-white border border-slate-100 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center gap-3">
                        <Settings className="w-4 h-4" />
                        Mi Perfil
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex-1 py-4 px-8 rounded-2xl bg-white border border-slate-100 text-xs font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 transition-all flex items-center justify-center gap-3"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </section>

            </main>

            <footer className="bg-white p-10 text-center space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Red Viva System • v2.0</p>
            </footer>

        </div>
    );
}

function HistoryItem({ title, time, status, color }: { title: string; time: string; status: string; color: string }) {
    const colors: any = {
        emerald: "bg-emerald-500",
        blue: "bg-blue-500",
        rose: "bg-rose-500"
    };

    return (
        <div className="p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className={cn("w-2 h-2 rounded-full", colors[color])} />
                <div>
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {time}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-400">{status}</span>
                <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary transition-colors" />
            </div>
        </div>
    );
}
