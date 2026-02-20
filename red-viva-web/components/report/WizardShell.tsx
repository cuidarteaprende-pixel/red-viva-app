import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardShellProps {
    currentStep: number;
    totalSteps: number;
    title: string;
    onNext: () => void;
    onBack: () => void;
    onSaveDraft: () => void;
    isLastStep: boolean;
    children: React.ReactNode;
    isValid?: boolean;
}

export const WizardShell: React.FC<WizardShellProps> = ({
    currentStep,
    totalSteps,
    title,
    onNext,
    onBack,
    onSaveDraft,
    isLastStep,
    children,
    isValid = true
}) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="flex flex-col min-h-screen bg-[#F0F7FF]">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        disabled={currentStep === 1}
                    >
                        <ChevronLeft className={cn("w-6 h-6", currentStep === 1 ? "text-slate-200" : "text-slate-600")} />
                    </button>
                    <div>
                        <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{title}</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paso {currentStep} de {totalSteps}</p>
                    </div>
                </div>

                <button
                    onClick={onSaveDraft}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-foreground flex items-center gap-1 px-3 py-1 rounded-lg border border-primary/10 hover:bg-primary/5 transition-all"
                >
                    <Save className="w-3 h-3" />
                    Borrador
                </button>
            </header>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                <motion.div
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Content */}
            <main className="flex-1 overflow-y-auto px-6 py-8 pb-32">
                <div className="max-w-md mx-auto">
                    {children}
                </div>
            </main>

            {/* Fixed Bottom Navigation */}
            <footer className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-lg border-t border-slate-100 flex items-center gap-4 z-20">
                {isLastStep ? (
                    <button
                        onClick={onNext}
                        disabled={!isValid}
                        className="flex-1 btn-premium bg-emerald-500 text-white shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 py-4"
                    >
                        <Send className="w-5 h-5" />
                        ENVIAR REPORTE COMPLETO
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        className="flex-1 btn-premium bg-slate-900 text-white shadow-xl shadow-slate-200 flex items-center justify-center gap-3 py-4"
                    >
                        GUARDAR Y CONTINUAR
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </footer>
        </div>
    );
};
