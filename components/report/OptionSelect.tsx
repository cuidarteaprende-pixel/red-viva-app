import { cn } from "@/lib/utils";

interface Option {
    label: string;
    value: string | number;
}

interface OptionSelectProps {
    label: string;
    options: Option[];
    value: any;
    onChange: (value: any) => void;
    columns?: number;
}

export default function OptionSelect({ label, options, value, onChange, columns = 2 }: OptionSelectProps) {
    return (
        <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                {label}
            </p>
            <div className={cn(
                "grid gap-2",
                columns === 1 ? "grid-cols-1" :
                    columns === 2 ? "grid-cols-2" :
                        "grid-cols-2 sm:grid-cols-3"
            )}>
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "py-4 px-4 rounded-2xl border-2 font-bold text-sm transition-all",
                            value === opt.value
                                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                        )}
                        aria-pressed={value === opt.value}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
