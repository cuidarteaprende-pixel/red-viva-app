import React from 'react';
import { cn } from '@/lib/utils';

interface QuickScaleProps {
    value: number;
    onChange: (val: number) => void;
    options?: { value: number; label: string; emoji: string }[];
}

const DEFAULT_OPTIONS = [
    { value: 1, label: 'Muy mal', emoji: '😞' },
    { value: 2, label: 'Mal', emoji: '😕' },
    { value: 3, label: 'Regular', emoji: '😐' },
    { value: 4, label: 'Bien', emoji: '🙂' },
    { value: 5, label: 'Muy bien', emoji: '😊' },
];

export const QuickScale: React.FC<QuickScaleProps> = ({ value, onChange, options = DEFAULT_OPTIONS }) => {
    return (
        <div className="grid grid-cols-5 gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all active:scale-95",
                        value === opt.value
                            ? "bg-primary/5 border-primary shadow-sm"
                            : "bg-white border-slate-50 text-slate-400 hover:border-slate-100"
                    )}
                >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className={cn(
                        "text-[8px] font-black uppercase tracking-tighter text-center leading-none",
                        value === opt.value ? "text-primary" : "text-slate-400"
                    )}>
                        {opt.label}
                    </span>
                </button>
            ))}
        </div>
    );
};
