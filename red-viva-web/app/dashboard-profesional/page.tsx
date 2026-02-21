/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import {
  Users,
  AlertTriangle,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Activity,
  Heart,
  LayoutDashboard,
  LogOut,
  Bell,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type EstadoPaciente = "estable" | "seguimiento" | "alerta";
type FiltroEstado = "todos" | EstadoPaciente;

type AdultoMayor = {
  id: string;
  nombre: string;
  edad: number;
  programa: string;
  estado: EstadoPaciente;
  ultimaActualizacion: string;
};

const DEMO_PACIENTES: AdultoMayor[] = [
  {
    id: "1",
    nombre: "Mercedes Valencia",
    edad: 84,
    programa: "Centro Día",
    estado: "estable",
    ultimaActualizacion: "Hoy, 10:24 AM",
  },
  {
    id: "2",
    nombre: "Arturo Calle",
    edad: 79,
    programa: "Acompañamiento",
    estado: "alerta",
    ultimaActualizacion: "Hoy, 08:30 AM",
  },
  {
    id: "3",
    nombre: "Elena Restrepo",
    edad: 92,
    programa: "Cuidado Hogar",
    estado: "seguimiento",
    ultimaActualizacion: "Ayer, 06:15 PM",
  },
  {
    id: "4",
    nombre: "Gustavo Petro",
    edad: 72,
    programa: "Centro Día",
    estado: "estable",
    ultimaActualizacion: "Hoy, 11:00 AM",
  },
  {
    id: "5",
    nombre: "Sofía Martínez",
    edad: 88,
    programa: "Prevención",
    estado: "alerta",
    ultimaActualizacion: "Hoy, 07:12 AM",
  },
];

export default function DashboardProfesional() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FiltroEstado>("todos");

  const filteredPacientes = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return DEMO_PACIENTES.filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(term) ||
        p.programa.toLowerCase().includes(term);
      const matchFilter = filter === "todos" || p.estado === filter;
      return matchSearch && matchFilter;
    });
  }, [searchTerm, filter]);

  const total = DEMO_PACIENTES.length;
  const alertas = DEMO_PACIENTES.filter((p) => p.estado === "alerta").length;

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col selection:bg-primary/20 relative overflow-hidden">
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Professional care"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex h-full flex-1 overflow-hidden">
        {/* Navigation Rail */}
        <nav className="w-20 md:w-24 bg-white border-r border-slate-100 flex flex-col items-center py-8 gap-8 z-20">
          {/* ✅ Logo: ahora navega al dashboard profesional */}
          <Link
            href="/dashboard-profesional"
            className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform cursor-pointer"
            aria-label="Ir a Dashboard"
          >
            <LayoutDashboard className="w-6 h-6" />
          </Link>

          {/* ✅ Menú con links reales */}
          <div className="space-y-6 flex-1">
            <NavLink href="/pro/patients" icon={<Users className="w-6 h-6" />} active={true} />
            <NavLink
              href="/dashboard-profesional"
              icon={<Bell className="w-6 h-6" />}
              active={false}
              badge={alertas}
            />
            <NavLink href="/pro/dashboard" icon={<TrendingUp className="w-6 h-6" />} active={false} />
          </div>

          <Link
            href="/"
            className="p-4 text-slate-400 hover:text-rose-500 transition-colors"
            aria-label="Salir"
          >
            <LogOut className="w-6 h-6" />
          </Link>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Análisis Interdisciplinario
              </h1>
              <p className="text-slate-500 font-medium">
                Panel de control y seguimiento de adultos mayores.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Sistema Online
                </span>
              </div>

              <div className="h-12 w-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-200">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User"
                />
              </div>
            </div>
          </header>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KpiCard
              label="Adultos en Seguimiento"
              value={total}
              icon={<Users className="w-5 h-5" />}
              color="blue"
              trend="+2 este mes"
            />
            <KpiCard
              label="Alertas Activas"
              value={alertas}
              icon={<AlertTriangle className="w-5 h-5" />}
              color="rose"
              trend="Requieren atención"
            />
            <KpiCard
              label="Actuaciones Hoy"
              value={12}
              icon={<Activity className="w-5 h-5" />}
              color="emerald"
              trend="Trazabilidad 100%"
            />
          </div>

          {/* Table / List Controls */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o programa..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <Filter className="w-4 h-4 text-slate-400" />
                <div className="flex bg-slate-50 p-1 rounded-2xl">
                  {(["todos", "estable", "seguimiento", "alerta"] as FiltroEstado[]).map(
                    (f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          filter === f
                            ? "bg-white text-primary shadow-sm"
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {f}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Adulto Mayor
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Programa
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Estado
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Monitorización
                    </th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {filteredPacientes.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                            {p.nombre[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{p.nombre}</p>
                            <p className="text-xs text-slate-500 font-medium">
                              {p.edad} años
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500">
                          {p.programa}
                        </span>
                      </td>

                      <td className="px-8 py-6">
                        <StatusPill status={p.estado} />
                      </td>

                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <Clock className="w-3 h-3" />
                          {p.ultimaActualizacion}
                        </div>
                      </td>

                      {/* ✅ Acciones ahora navegan */}
                      <td className="px-8 py-6 text-right">
                        <Link
                          href={`/pro/patients/${p.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary active:scale-95 transition-all"
                        >
                          Ver Detalle
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPacientes.length === 0 && (
                <div className="p-20 text-center">
                  <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-medium">
                    No se encontraron pacientes registrados.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon,
  active,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative block p-4 rounded-2xl transition-all active:scale-90",
        active ? "text-primary" : "text-slate-300 hover:text-slate-500 hover:bg-slate-50"
      )}
      aria-label={`Ir a ${href}`}
    >
      {icon}
      {!!badge && badge > 0 && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

function KpiCard({
  label,
  value,
  icon,
  color,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "rose" | "emerald";
  trend: string;
}) {
  const colors: Record<"blue" | "rose" | "emerald", string> = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4 transition-transform hover:scale-[1.02]">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", colors[color])}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
      <div className="pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 flex items-center gap-2">
        {color === "rose" && <AlertTriangle className="w-3 h-3 text-rose-500" />}
        {trend}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: AdultoMayor["estado"] }) {
  const styles: Record<EstadoPaciente, string> = {
    estable: "bg-emerald-50 text-emerald-600 border-emerald-100",
    seguimiento: "bg-blue-50 text-blue-600 border-blue-100",
    alerta: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}