import React from 'react';

export default function RedVivaDashboard() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Red Viva: Panel de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold">Último Evento Detectado</h2>
          <p className="text-gray-600 mt-2">Esperando datos de la trituradora...</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-green-500">
          <h2 className="text-xl font-semibold">Estado del Paciente</h2>
          <p className="text-gray-600 mt-2">Estable - Monitoreo activo</p>
        </div>
      </div>
    </div>
  );
}