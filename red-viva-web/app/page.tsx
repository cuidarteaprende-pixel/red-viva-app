import React from 'react';

export default function DashboardRedViva() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      {/* Cabecera */}
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-blue-900">Red Viva</h1>
          <p className="text-slate-500">Acompañamiento Inteligente para Adultos Mayores</p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
          Estado: Monitoreando
        </div>
      </header>

      {/* Tarjetas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700">Próxima Actividad</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">Caminata 10 AM</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700">Estado de Ánimo</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">Excelente</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700">Alertas</h2>
          <p className="text-3xl font-bold text-red-500 mt-2">0</p>
        </div>
      </div>

      {/* Sección de la IA (Trituradora) */}
      <div className="mt-10 bg-blue-900 text-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Registro de Acompañamiento</h2>
        <div className="bg-blue-800 p-4 rounded-xl italic">
          "Aquí aparecerá el resumen procesado por la IA de Red Viva..."
        </div>
      </div>
    </div>
  );
}