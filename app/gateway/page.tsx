"use client";

import { motion } from "framer-motion";
import { Heart, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function GatewayPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary/20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_40%)] from-primary/5">
            <div className="w-full max-w-5xl space-y-12">
                {/* Logo & Header */}
                <header className="text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center intro-animateheader"
                    >
                        <img
                            src="/red-viva-logo.png"
                            alt="Red Viva Logo"
                            className="h-24 md:h-32 w-auto mb-6 drop-shadow-sm transition-transform hover:scale-105 duration-700"
                        />
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 shadow-sm mb-4">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                Acompañamiento Inteligente y Ético
                            </span>
                        </div>
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="text-5xl md:text-7xl font-display font-black text-slate-900 tracking-tight intro-animatetitle"
                        >
                            Cuidamos lo que <span className="text-primary italic">más importa.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-xl text-slate-500 max-w-2xl mx-auto font-medium"
                        >
                            Bienvenido a Red Viva. Elija su portal para comenzar con el seguimiento interdisciplinario de calidad.
                        </motion.p>
                    </div>
                </header>

                {/* Roles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Caregiver Option */}
                    <RoleCard
                        href="/auth/login?role=caregiver"
                        title="Soy Cuidador"
                        description="Registro de actividades diarias, signos vitales y alertas inmediatas."
                        icon={<Heart className="w-8 h-8 text-rose-500" />}
                        image="/caregiver_portal.jpg"
                        color="rose"
                        delay={0.3}
                        className="intro-animatecard-left"
                    />

                    {/* Professional Option */}
                    <RoleCard
                        href="/auth/login?role=pro"
                        title="Soy Profesional"
                        description="Gestión clínica, análisis de tendencias con IA y línea de tiempo inmutable."
                        icon={<ShieldCheck className="w-8 h-8 text-primary" />}
                        image="/professional_portal.jpg"
                        color="blue"
                        delay={0.4}
                        className="intro-animatecard-right"
                    />
                </div>

                {/* Footer info */}
                <footer className="text-center pt-12 border-t border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        &copy; {new Date().getFullYear()} Red Viva • Tecnología para la vida
                    </p>
                </footer>
            </div>
        </div>
    );
}

function RoleCard({
    href,
    title,
    description,
    icon,
    image,
    color,
    delay,
    className
}: {
    href: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    image: string;
    color: "rose" | "blue";
    delay: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={cn("h-full", className)}
        >
            <Link
                href={href}
                className={cn(
                    "group relative block h-full rounded-[3rem] bg-white border-2 border-slate-100 transition-all hover:shadow-2xl hover:shadow-slate-200 overflow-hidden focus:outline-none focus:ring-4 focus:ring-primary/10 hover-card",
                    color === "rose" ? "hover:border-rose-100" : "hover:border-primary/20"
                )}
            >
                {/* Photo Header */}
                <div className="h-48 relative overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>

                <div className="relative z-10 px-8 pb-10 -mt-8 flex flex-col h-[280px]">
                    <div className={cn(
                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-xl transition-transform group-hover:scale-110 group-hover:-rotate-3",
                        color === "rose" ? "bg-white text-rose-500" : "bg-white text-primary"
                    )}>
                        {icon}
                    </div>

                    <h3 className="text-3xl font-black font-display text-slate-900 mb-3 tracking-tight">{title}</h3>
                    <p className="text-slate-500 font-medium text-lg leading-snug mb-8">{description}</p>

                    <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                        Ingresar al Portal
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>

                {/* Decorative background shape */}
                <div className={cn(
                    "absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-5 transition-transform group-hover:scale-150",
                    color === "rose" ? "bg-rose-500" : "bg-primary"
                )} />
            </Link>
        </motion.div>
    );
}
