/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Heart, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-primary/20 relative overflow-hidden">
      {/* Background radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_40%)] from-primary/5 pointer-events-none" />

      <div className="w-full max-w-6xl space-y-12 z-10">
        {/* Header with Logo */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="flex flex-col items-start gap-4">
            <img
              src="/red-viva-logo.png"
              alt="Red Viva"
              style={{ height: "280px", width: "auto" }}
              className="drop-shadow-[0_20px_50px_rgba(37,99,235,0.2)] object-contain -ml-4"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement("div");
                  fallback.className =
                    "text-7xl font-black text-blue-900 flex items-center gap-2 mb-4";
                  fallback.innerHTML = "<span>Red Viva</span>";
                  parent.appendChild(fallback);
                }
              }}
            />
            <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-100 border border-blue-200 text-xs font-black text-blue-700 uppercase tracking-[0.2em] shadow-sm ml-4">
              Tecnología para la Vida
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center md:text-left max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none mb-6">
            Cuidado ético con <span className="text-primary italic">propósito.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Bienvenido al ecosistema Red Viva. Seleccione su portal para continuar con el
            seguimiento interdisciplinario de calidad.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RoleCard
            href="/cuidador"
            title="Portal Cuidador"
            subtitle="Registrar Reporte Diario"
            description="Bitácora 360°, registro de signos vitales, alimentación y avisos de eventos críticos."
            icon={<Heart className="w-8 h-8 text-rose-500" />}
            image="https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg?auto=compress&cs=tinysrgb&w=1200"
            color="rose"
          />

          <RoleCard
            href="/dashboard-profesional"
            title="Portal Profesional"
            subtitle="Análisis y Gestión Interdisciplinaria"
            description="Dashboard clínico, KPIs en tiempo real, validación de casos y trazabilidad ética."
            icon={<ShieldCheck className="w-8 h-8 text-blue-600" />}
            image="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1200"
            color="blue"
          />
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>&copy; {new Date().getFullYear()} Red Viva • Todos los derechos reservados</span>
          <div className="flex gap-6">
            <span className="text-slate-900">WCAG AA Compliant</span>
            <span className="text-slate-900">Blockchain Traceability</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function RoleCard({
  href,
  title,
  subtitle,
  description,
  icon,
  image,
  color,
}: {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  color: "rose" | "blue";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block h-full min-h-[420px] rounded-[2.5rem] overflow-hidden",
        "border border-slate-200/70 bg-white shadow-xl shadow-slate-200/50",
        "transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99]",
        "focus-visible:ring-4 focus-visible:ring-primary/20 outline-none"
      )}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ opacity: 1 }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.className +=
                color === "rose"
                  ? " bg-gradient-to-br from-rose-100 to-white"
                  : " bg-gradient-to-br from-blue-100 to-white";
            }
          }}
        />

        {/* ✅ overlay fuerte: asegura legibilidad SIEMPRE */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* highlight sutil */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-10 flex flex-col h-full">
        <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110">
          {icon}
        </div>

        <div className="mt-auto">
          {/* ✅ panel “glass” detrás del texto */}
         <div className="inline-block rounded-2xl bg-white/65 backdrop-blur-sm px-5 py-4 shadow-lg ring-1 ring-black/5 max-w-[92%]">
            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-widest mb-2 block",
                color === "rose" ? "text-rose-600" : "text-blue-600"
              )}
            >
              {subtitle}
            </span>

            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-slate-700 font-medium text-base leading-relaxed mb-5 max-w-sm">
              {description}
            </p>

            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-900 group-hover:gap-4 transition-all">
              Ingresar Ahora <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-2",
          color === "rose" ? "bg-rose-500" : "bg-blue-600"
        )}
      />
    </Link>
  );
}