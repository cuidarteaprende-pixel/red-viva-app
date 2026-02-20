import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface YesNoChipsProps {
    value: boolean | null;
    onChange: (val: boolean) => void;
}

export const YesNoChips: React.FC<YesNoChipsProps> = ({ value, onChange }) => {
    return (
        <div className="flex gap-4">
            <button
                type="button"
                onClick={() => onChange(true)}
                className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 font-black transition-all active:scale-95",
                    value === true
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-50 bg-white text-slate-400 hover:border-slate-100"
                )}
            >
                <Check className={cn("w-5 h-5", value === true ? "text-emerald-500" : "text-slate-200")} />
                SÍ
            </button>
            <button
                type="button"
                onClick={() => onChange(false)}
                className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 font-black transition-all active:scale-95",
                    value === false
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-slate-50 bg-white text-slate-400 hover:border-slate-100"
                )}
            >
                <X className={cn("w-5 h-5", value === false ? "text-rose-500" : "text-slate-200")} />
                NO
            </button>
        </div>
    );
};
