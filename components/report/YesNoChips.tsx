import { cn } from "@/lib/utils";

interface YesNoChipsProps {
    label: string;
    value: boolean | null;
    onChange: (value: boolean) => void;
    ariaLabel?: string;
}

export default function YesNoChips({ label, value, onChange, ariaLabel }: YesNoChipsProps) {
    return (
        <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                {label}
            </p>
            <div className="flex gap-3" role="group" aria-label={ariaLabel || label}>
                {[
                    { label: "Sí", value: true, color: "bg-emerald-500" },
                    { label: "No", value: false, color: "bg-rose-500" },
                ].map((opt) => (
                    <button
                        key={opt.label}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all border-2",
                            value === opt.value
                                ? `${opt.color} text-white border-transparent shadow-lg transform scale-[1.02]`
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
