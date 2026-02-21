function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/80 backdrop-blur-md p-6 md:p-7 shadow-[0_18px_55px_rgba(2,6,23,0.06)]">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="relative">
        <h3 className="text-lg md:text-xl font-black text-slate-900">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-600 font-medium mt-1">{subtitle}</p> : null}
        <div className="mt-5 space-y-5">{children}</div>
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-700"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecciona…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-black text-slate-700">{label}</p>
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-5 py-3 rounded-2xl border font-black text-sm transition-all active:scale-[0.98] ${
            value === true
              ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20"
              : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
          }`}
          onClick={() => onChange(true)}
        >
          Sí
        </button>
        <button
          type="button"
          className={`px-5 py-3 rounded-2xl border font-black text-sm transition-all active:scale-[0.98] ${
            value === false
              ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10"
              : "bg-white border-slate-200 text-slate-900 hover:bg-slate-50"
          }`}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-black text-slate-700">{label}</span>
      <textarea
        className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}