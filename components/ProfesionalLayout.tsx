"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { profesionalService, UsuarioProfesional } from "@/lib/profesionalService";

export default function ProfesionalLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<UsuarioProfesional | null>(null);
    const [loading, setLoading] = useState(true);
    const [navExpanded, setNavExpanded] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            if (pathname !== '/profesional') {
                router.push('/profesional');
            }
        } else {
            try {
                const profile = await profesionalService.getPerfil(session.user.id);
                setUser(profile);
            } catch (err) {
                console.error("No se encontró perfil profesional", err);
                router.push('/profesional');
            }
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/profesional');
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    if (!user && pathname !== '/profesional') return null;

    if (pathname === '/profesional' && !user) return <>{children}</>;

    const menuItems = [
        { icon: 'grid_view', label: 'Dashboard', href: '/dashboard' },
        { icon: 'notifications_active', label: 'Alertas', href: '/alertas' },
        { icon: 'groups', label: 'Casos CAS', href: '/casos-cas' },
        { icon: 'analytics', label: 'Reportes', href: '/reportes' },
        { icon: 'settings', label: 'Ajustes', href: '/ajustes' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex text-slate-900 border-t-4 border-primary">
            {/* Sidebar */}
            <aside className={`${navExpanded ? 'w-72' : 'w-24'} bg-slate-900 text-white flex flex-col transition-all duration-300 overflow-hidden shrink-0 border-r border-white/5 z-40`}>
                <div className="p-8 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/red-viva-logo.png" alt="Red Viva" className="h-8 w-auto" />
                        {navExpanded && <span className="font-outfit font-black text-2xl tracking-tighter uppercase">Red Viva</span>}
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-2 relative z-50">
                    {menuItems.map(item => (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.href)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer pointer-events-auto ${pathname === item.href ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            <span className="material-symbols-rounded">{item.icon}</span>
                            {navExpanded && <span className="font-bold text-sm">{item.label}</span>}
                        </button>
                    ))}
                </nav>
                <div className="p-6">
                    {user && (
                        <div className="bg-white/5 p-4 rounded-2xl mb-4">
                            <p className="text-[10px] font-black text-slate-500 uppercase truncate">{user.nombre}</p>
                        </div>
                    )}
                    <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-white/5 text-slate-400 text-[10px] font-black uppercase flex items-center justify-center gap-2">
                        <span className="material-symbols-rounded text-sm">logout</span>
                        {navExpanded && 'Salir'}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 h-screen overflow-y-auto bg-slate-50">
                {children}
            </main>
        </div>
    );
}
