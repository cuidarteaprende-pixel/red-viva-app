/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
    Users,
    Search,
    Filter,
    Plus,
    MoreVertical,
    History,
    Activity,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const PATIENTS = [
    { id: "1", nombre: "Mercedes Valencia", edad: 84, ingreso: "12 Ene 2024", estado: "estable", responsable: "Hija - Claudia" },
    { id: "2", nombre: "Arturo Calle", edad: 79, ingreso: "05 Feb 2024", estado: "alerta", responsable: "Hijo - Carlos" },
    { id: "3", nombre: "Elena Restrepo", edad: 92, ingreso: "20 Dic 2023", estado: "seguimiento", responsable: "Enfermera - Luz" },
    { id: "4", nombre: "Gustavo Petro", edad: 72, ingreso: "15 Mar 2024", estado: "estable", responsable: "Familiar - Nicolas" },
    { id: "5", nombre: "Sofía Martínez", edad: 88, ingreso: "02 Abr 2024", estado: "alerta", responsable: "Hijo - Jose" },
    { id: "6", nombre: "Pedro Juan", edad: 75, ingreso: "10 May 2024", estado: "estable", responsable: "Esposa - Maria" },
];

export default function PatientsPage() {
    const [query, setQuery] = useState("");

    const filtered = PATIENTS.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Registro de Adultos Mayores</h1>
                    <p className="text-slate-500 font-medium">Gestión integral y trazabilidad de la población a cargo.</p>
                </div>
                <button className="btn-premium bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-900/10 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Vincular Adulto Mayor
                </button>
            </header>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, documento o responsable..."
                        className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium outline-none shadow-sm focus:ring-4 focus:ring-slate-900/5 transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <FilterButton label="Todos" active={true} />
                    <FilterButton label="Alertas" active={false} count={2} />
                    <FilterButton label="Nuevos" active={false} />
                </div>
            </div>

            {/* PATIENTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p) => (
                    <PatientCard key={p.id} patient={p} />
                ))}
            </div>
        </div>
    );
}

function FilterButton({ label, active, count }: { label: string; active: boolean; count?: number }) {
    return (
        <button className={cn(
            "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border shadow-sm",
            active ? "bg-white border-slate-900 text-slate-900" : "bg-white border-slate-100 text-slate-400 hover:text-slate-600"
        )}>
            {label}
            {count && <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[8px]">{count}</span>}
        </button>
    );
}

function PatientCard({ patient }: { patient: any }) {
    const statusColors: any = {
        estable: "bg-emerald-50 text-emerald-600 border-emerald-100",
        alerta: "bg-rose-50 text-rose-600 border-rose-100",
        seguimiento: "bg-blue-50 text-blue-600 border-blue-100"
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 group hover:scale-[1.02] transition-transform">
            <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-xl font-black text-slate-300">
                    {patient.nombre[0]}
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">{patient.nombre}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    {patient.edad} años • Ingreso: {patient.ingreso}
                </p>
            </div>

            <div className="flex items-center justify-between py-4 border-y border-slate-50">
                <span className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                    statusColors[patient.estado]
                )}>
                    {patient.estado}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    <History className="w-3 h-3" />
                    Bitácora Activa
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Responsable Principal</p>
                <p className="text-sm font-bold text-slate-600">{patient.responsable}</p>
            </div>

            <button className="w-full py-4 rounded-2xl bg-slate-50 text-slate-900 font-bold text-xs hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white">
                Gestionar Expediente
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
