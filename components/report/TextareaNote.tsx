import { cn } from "@/lib/utils";

interface TextareaNoteProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
}

export default function TextareaNote({ label = "¿Qué notaste? (opcional)", placeholder, value, onChange, rows = 3 }: TextareaNoteProps) {
    return (
        <div className="space-y-2 mt-4">
            {label && (
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    {label}
                </label>
            )}
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Escribe aquí tus observaciones..."}
                rows={rows}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium outline-none focus:border-primary/30 transition-all resize-none"
            />
        </div>
    );
}
