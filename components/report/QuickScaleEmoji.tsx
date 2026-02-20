import { cn } from "@/lib/utils";

interface Option {
    label: string;
    value: string | number;
    emoji?: string;
}

interface QuickScaleEmojiProps {
    label: string;
    options: Option[];
    value: string | number | null;
    onChange: (value: any) => void;
}

export default function QuickScaleEmoji({ label, options, value, onChange }: QuickScaleEmojiProps) {
    return (
        <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">
                {label}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all transition-all duration-300",
                            value === opt.value
                                ? "bg-primary text-white border-primary shadow-md scale-[1.03]"
                                : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                        )}
                        aria-pressed={value === opt.value}
                    >
                        {opt.emoji && <span className="text-2xl mb-1">{opt.emoji}</span>}
                        <span className="text-[11px] font-bold text-center leading-tight">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
