"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // role puede venir como ?role=pro o ?role=caregiver
    const role = (searchParams.get("role") || "caregiver").toLowerCase();
    const isPro = role === "pro" || role === "profesional";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const sendRecovery = async () => {
        try {
            if (!email.trim()) {
                toast.error("Escribe tu correo primero.");
                return;
            }

            setLoading(true);

            // IMPORTANTE: NO hacemos pre-check a cuidadores/profesionales aquí.
            // El recovery se envía siempre.
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/auth/reset_password`,
            });

            if (error) throw error;

            toast.success("Te enviamos un correo para restablecer tu contraseña.");
        } catch (e: any) {
            toast.error(e?.message ?? "No se pudo enviar el correo de recuperación.");
        } finally {
            setLoading(false);
        }
    };

    const handleAccess = async () => {
        try {
            if (!email.trim()) {
                toast.error("Escribe tu correo.");
                return;
            }

            setLoading(true);

            // PROFESIONALES: requieren password
            if (isPro) {
                if (!password.trim()) {
                    toast.error("Escribe tu contraseña para ingresar como profesional.");
                    return;
                }

                const { data: authData, error: authError } =
                    await supabase.auth.signInWithPassword({
                        email: email.trim(),
                        password: password,
                    });

                if (authError) throw authError;
                if (!authData?.user) throw new Error("No se pudo iniciar sesión.");

                // Validar rol profesional DESPUÉS de autenticar
                const { data: profile, error: proErr } = await supabase
                    .from("usuarios_profesionales")
                    .select("rol")
                    .eq("auth_user_id", authData.user.id)
                    .maybeSingle();

                if (proErr) throw proErr;

                if (!profile?.rol) {
                    await supabase.auth.signOut();
                    throw new Error("No tienes un perfil profesional asignado.");
                }

                toast.success("Sesión iniciada correctamente.");
                router.push("/pro/dashboard");
                return;
            }

            // CUIDADORES: si hay password, login normal; si no, enviamos acceso seguro (OTP/Magic Link)
            if (password.trim()) {
                const { data: authData, error: authError } =
                    await supabase.auth.signInWithPassword({
                        email: email.trim(),
                        password: password,
                    });

                if (authError) throw authError;
                if (!authData?.user) throw new Error("No se pudo iniciar sesión.");

                // Validar cuidador DESPUÉS de autenticar
                const { data: caregiver, error: careErr } = await supabase
                    .from("cuidadores")
                    .select("rol")
                    .eq("auth_user_id", authData.user.id)
                    .maybeSingle();

                if (careErr) throw careErr;

                const validRoles = ["caregiver", "cuidador"];
                const userRole = String(caregiver?.rol ?? "").toLowerCase();

                if (!userRole || !validRoles.includes(userRole)) {
                    await supabase.auth.signOut();
                    throw new Error("Tu correo no está habilitado como cuidador.");
                }

                toast.success("Sesión iniciada correctamente.");
                router.push("/cuidador");
                return;
            }

            // Si NO hay password: enviamos link/código de acceso seguro
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email: email.trim(),
                options: {
                    // Debe existir app/auth/callback
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/cuidador`,
                },
            });

            if (otpError) throw otpError;

            toast.success("Te enviamos un acceso seguro a tu correo.");
            // No validamos rol aquí porque aún NO hay sesión.
            return;
        } catch (e: any) {
            toast.error(e?.message ?? "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center gap-2 mb-6">
                    <Link
                        href="/"
                        className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                        <ArrowLeft size={16} /> Volver
                    </Link>
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isPro ? "Acceso Profesional" : "Portal Cuidador"}
                    </h1>
                    <p className="text-slate-500 mt-2">
                        {isPro
                            ? "Ingresa con tu correo y contraseña."
                            : "Ingresa tu correo para recibir tu acceso seguro. La contraseña es opcional."}
                    </p>
                </div>

                <div className="space-y-4">
                    <label className="block">
                        <span className="text-xs font-semibold tracking-wide text-slate-500">
                            CORREO ELECTRÓNICO
                        </span>
                        <div className="mt-1 flex items-center gap-2 border rounded-2xl px-3 py-3 bg-slate-50">
                            <Mail className="text-slate-400" size={18} />
                            <input
                                className="w-full bg-transparent outline-none text-slate-800"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tucorreo@dominio.com"
                                autoComplete="email"
                            />
                        </div>
                    </label>

                    <label className="block">
                        <span className="text-xs font-semibold tracking-wide text-slate-500">
                            CONTRASEÑA {isPro ? "" : "(opcional)"}
                        </span>
                        <div className="mt-1 flex items-center gap-2 border rounded-2xl px-3 py-3 bg-slate-50">
                            <Lock className="text-slate-400" size={18} />
                            <input
                                className="w-full bg-transparent outline-none text-slate-800"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isPro ? "Tu contraseña" : "Si la recuerdas, escríbela"}
                                type="password"
                                autoComplete={isPro ? "current-password" : "current-password"}
                            />
                        </div>
                    </label>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={sendRecovery}
                            disabled={loading}
                            className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline"
                        >
                            ¿No puede ingresar? Recuperar clave
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleAccess}
                        disabled={loading}
                        className="w-full rounded-2xl py-4 font-bold text-white bg-pink-600 hover:bg-pink-700 transition flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                        ACCESO SEGURO
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-4">
                        CUIDADO ÉTICO & TRANSPARENTE · WCAG AA COMPLIANT
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    // useSearchParams requiere Suspense en App Router
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F0F7FF]" />}>
            <LoginForm />
        </Suspense>
    );
}

