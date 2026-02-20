"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LogOut, Home, AlertCircle, FileText, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CareLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/auth/login?role=caregiver");
            } else {
                setUser(session.user);
            }
            setLoading(false);
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/gateway");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const navItems = [
        { label: "Inicio", icon: Home, href: "/care/home" },
        { label: "Diario", icon: FileText, href: "/care/report/daily" },
        { label: "Urgencia", icon: AlertCircle, href: "/care/report/urgent", color: "text-destructive" },
        // { label: "Perfil", icon: User, href: "/care/profile" },
    ];

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-64">
            {/* Mobile Top Header */}
            <header className="md:hidden bg-white border-b border-border px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img
                        src="/red-viva-logo.png"
                        alt="Red Viva Logo"
                        className="w-8 h-8 object-contain"
                    />
                    <span className="font-display font-black text-slate-900 tracking-tight">RED VIVA</span>
                </div>
                <button onClick={handleLogout} className="p-2 text-muted-foreground">
                    <LogOut className="w-5 h-5" />
                </button>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border h-screen fixed left-0 top-0 z-50 p-6">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <img
                        src="/red-viva-logo.png"
                        alt="Red Viva Logo"
                        className="w-10 h-10 object-contain"
                    />
                    <span className="font-display font-black text-xl text-slate-900 tracking-tight">RED VIVA</span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all",
                                pathname === item.href
                                    ? "bg-primary text-white shadow-md shadow-primary/10"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                item.color
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="pt-6 border-t border-border mt-auto">
                    <div className="flex items-center gap-3 px-2 mb-6">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                            <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-black text-foreground truncate">{user?.email}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Cuidador Activo</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-destructive hover:bg-destructive/5 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="p-6 max-w-5xl mx-auto">
                {children}
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl z-50 px-4 py-2 flex items-center justify-around">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 p-3 rounded-2xl transition-all",
                            pathname === item.href ? "text-primary scale-110" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className={cn("w-6 h-6", pathname === item.href && "fill-primary/10")} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}

function HeartPulse({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
        </svg>
    );
}
