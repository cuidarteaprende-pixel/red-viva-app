/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

export default function ProLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: "/pro/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: "/pro/patients", label: "Pacientes", icon: <Users className="w-5 h-5" /> },
    { href: "/dashboard-profesional", label: "Análisis 360", icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex selection:bg-slate-900 selection:text-white">
      <Toaster position="top-right" richColors />

      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 overflow-y-auto z-30">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/10 group-active:scale-90 transition-transform">
              <span className="font-black text-xs">RV</span>
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm tracking-tight">Red Viva</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pro Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-4 rounded-2xl transition-all group",
                  active
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4 text-white/50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-50 rounded-3xl p-6 mb-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Dr. Alejandro</p>
                <p className="text-[10px] font-bold text-slate-400">Coordinador</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-500 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder="Buscar paciente, registro o cita..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-2 text-xs font-medium focus:ring-4 focus:ring-slate-900/5 transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2" />
            <div className="hidden md:block text-right">
              <p className="text-xs font-black text-slate-900">Hospital San Vicente</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sede Principal</p>
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
