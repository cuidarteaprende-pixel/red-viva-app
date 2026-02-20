/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Users,
  Clock,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProDashboard() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Buenas tardes, Dr. Alejandro</h1>
        <p className="text-slate-500 font-medium">Aquí está el resumen de sus casos para el día de hoy.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Pacientes Activos"
          value="48"
          icon={<Users className="w-5 h-5" />}
          trend="+4%"
          trendUp={true}
        />
        <StatCard
          label="Citas Pendientes"
          value="12"
          icon={<Calendar className="w-5 h-5" />}
          trend="Hoy"
          trendUp={true}
        />
        <StatCard
          label="Reportes Críticos"
          value="03"
          icon={<Activity className="w-5 h-5" />}
          trend="-12%"
          trendUp={false}
          isWarning={true}
        />
        <StatCard
          label="Acompañamientos"
          value="156"
          icon={<Heart className="w-5 h-5" />}
          trend="+20%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

        {/* Recent Activity */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Actividad Reciente</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver todo</button>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 divide-y divide-slate-50">
            <ActivityItem
              name="Mercedes Valencia"
              action="Reporte Diario Registrado"
              time="Hace 5 min"
              type="report"
              status="estable"
            />
            <ActivityItem
              name="Arturo Calle"
              action="Alerta de Caída Registrada"
              time="Hace 24 min"
              type="event"
              status="alerta"
            />
            <ActivityItem
              name="Elena Restrepo"
              action="Actuación de Gerontología"
              time="Hace 1 hora"
              type="action"
              status="seguimiento"
            />
            <ActivityItem
              name="Gustavo Petro"
              action="Control de Signos Vitales"
              time="Hace 2 horas"
              type="report"
              status="estable"
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Agenda de Hoy</h2>
          <div className="space-y-4">
            <ScheduleItem time="02:30 PM" name="Mercedes Valencia" type="Consulta" />
            <ScheduleItem time="04:00 PM" name="Arturo Calle" type="Seguimiento" />
            <ScheduleItem time="05:15 PM" name="Sofía Martínez" type="Valoración" />
          </div>
          <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-black transition-all">
            Nueva Cita / Actuación
          </button>
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend, trendUp, isWarning }: { label: string; value: string; icon: React.ReactNode; trend: string; trendUp?: boolean; isWarning?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center",
        isWarning ? "bg-rose-50 text-rose-500" : "bg-slate-50 text-slate-900"
      )}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
          <span className={cn(
            "text-[10px] font-black flex items-center gap-1",
            trendUp ? "text-emerald-500" : (isWarning ? "text-rose-500" : "text-slate-400")
          )}>
            {trendUp && <ArrowUpRight className="w-3 h-3" />}
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ name, action, time, type, status }: { name: string; action: string; time: string; type: string; status: string }) {
  return (
    <div className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs",
          status === 'alerta' ? "bg-rose-500" : status === 'seguimiento' ? "bg-blue-500" : "bg-emerald-500"
        )}>
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{name}</p>
          <p className="text-xs text-slate-500 font-medium">{action}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">{time}</p>
        <div className={cn(
          "inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
          type === 'event' ? "border-rose-100 text-rose-500 bg-rose-50" : "border-slate-100 text-slate-400 bg-slate-50"
        )}>
          {type}
        </div>
      </div>
    </div>
  );
}

function ScheduleItem({ time, name, type }: { time: string; name: string; type: string }) {
  return (
    <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-center border-r border-slate-100 pr-4">
          <p className="text-[10px] font-black text-slate-900">{time.split(' ')[0]}</p>
          <p className="text-[10px] font-bold text-slate-400">{time.split(' ')[1]}</p>
        </div>
        <div>
          <p className="text-xs font-black text-slate-900">{name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{type}</p>
        </div>
      </div>
      <button className="p-2 text-slate-200 hover:text-primary transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
