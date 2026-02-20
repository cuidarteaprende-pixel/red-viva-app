import React from 'react';

interface FieldTextareaProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
    rows?: number;
}

export const FieldTextarea: React.FC<FieldTextareaProps> = ({ label, placeholder, value, onChange, rows = 3 }) => {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{label}</label>
            <textarea
                className="w-full bg-white border border-slate-100 rounded-[2rem] p-6 text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm placeholder:text-slate-300 min-h-[120px]"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
            />
        </div>
    );
};
