import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#020617] text-white selection:bg-primary/30">
      {/* Dynamic Background Image Section */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero_background.png"
          alt="Acompañamiento Red Viva"
          className="w-full h-full object-cover"
        />
        {/* Overlay for legibility: darken + desaturate + blur */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/30"></div>
      </div>

      {/* Background Orbs */}
      <div className="absolute top-0 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse"></div>
      <div className="absolute bottom-0 -right-48 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] animate-pulse delay-700"></div>

      {/* Top Header with Logo */}
      <header className="absolute top-0 left-0 w-full z-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <img src="/red-viva-logo.png" alt="Red Viva Logo" className="brand-logo" />
            <div className="h-10 w-px bg-white/20 mx-1"></div>
            <span className="text-2xl md:text-3xl font-black font-outfit tracking-tighter text-white uppercase">Red Viva</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col items-center justify-center min-h-screen">

        {/* Status Chip & Hero Title */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-medium tracking-wide uppercase">Sistema Red Viva Activo</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-outfit font-black tracking-tighter mb-4">
            RED <span className="text-gradient">VIVA</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto">
            Acompañamiento <span className="text-white font-medium">inteligente y ético</span> para el cuidado interdisciplinario de adultos mayores.
          </p>
        </div>

        {/* Entry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

          {/* Caregiver Entry */}
          <Link href="/cuidador" className="group">
            <div className="relative h-full glass-card-dark rounded-[2.5rem] p-8 border hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform duration-500 opacity-20 group-hover:opacity-40">
                <span className="material-symbols-rounded text-8xl">volunteer_activism</span>
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-rounded text-3xl text-primary">person_add</span>
                </div>
                <h3 className="text-3xl font-bold mb-3 font-outfit">Cuidadores y Auxiliares</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Registro rápido de observaciones diarias y eventos críticos. Acceso simplificado para monitoreo constante.
                </p>
                <div className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                  Ingresar ahora <span className="material-symbols-rounded">arrow_forward</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Professional Entry */}
          <Link href="/profesional" className="group">
            <div className="relative h-full glass-card-dark rounded-[2.5rem] p-8 border hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform duration-500 opacity-20 group-hover:opacity-40">
                <span className="material-symbols-rounded text-8xl">clinical_notes</span>
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                  <span className="material-symbols-rounded text-3xl text-indigo-400">admin_panel_settings</span>
                </div>
                <h3 className="text-3xl font-bold mb-3 font-outfit">Panel Profesional</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Dashboard interdisciplinario con análisis de IA, alertas en tiempo real y bitácora clínica inmutable.
                </p>
                <div className="inline-flex items-center gap-2 text-indigo-400 font-bold group-hover:gap-4 transition-all">
                  Acceso Especializado <span className="material-symbols-rounded">lock</span>
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* Footer Note */}
        <p className="mt-20 text-slate-500 text-sm font-medium tracking-widest uppercase">
          Ética • Transparencia • Cuidado Humano
        </p>
      </div>
    </main>
  );
}