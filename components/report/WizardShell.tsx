import { cn } from "@/lib/utils";
import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface WizardShellProps {
    currentStep: number;
    totalSteps: number;
    title: string;
    description: string;
    children: React.ReactNode;
    onBack: () => void;
    canBack: boolean;
    onSaveDraft?: () => void;
}

export default function WizardShell({
    currentStep,
    totalSteps,
    title,
    description,
    children,
    onBack,
    canBack,
    onSaveDraft
}: WizardShellProps) {
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Top Progress & Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {canBack ? (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-600 transition-colors"
                                aria-label="Volver al paso anterior"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        ) : (
                            <Link
                                href="/care/home"
                                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-600 transition-colors"
                                aria-label="Cerrar y salir"
                            >
                                <X className="w-5 h-5" />
                            </Link>
                        )}
                        <div className="intro-animateheader">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                PASO {currentStep + 1} DE {totalSteps}
                            </p>
                            <h1 className="text-sm font-bold text-slate-900 truncate max-w-[150px]">
                                {title}
                            </h1>
                        </div>
                    </div>

                    <button
                        onClick={onSaveDraft}
                        className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                        Borrador
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-50">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary progress-bar-glow"
                        transition={{ duration: 0.5, ease: "circOut" }}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-xl mx-auto w-full px-6 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2 intro-animatetitle">
                            <h2 className="text-3xl font-black font-display text-slate-900 leading-tight">
                                {title}
                            </h2>
                            <p className="text-slate-500 font-medium text-lg leading-snug">
                                {description}
                            </p>
                        </div>

                        <div className="pb-32">
                            {children}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
