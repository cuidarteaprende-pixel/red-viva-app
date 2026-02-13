"use client";

import { useState } from "react";

export default function ReporteCuidador() {
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState(false);

  const [tipoReporte, setTipoReporte] =
    useState<"diario" | "evento">("diario");

  const handleSend = async () => {
    if (!mensaje.trim()) return;

    setLoading(true);
    setError(false);
    setEnviado(false);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_RED_VIVA_WEBHOOK_URL as string,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipoReporte,
            message: mensaje,
          }),
        }
      );

      if (!res.ok) throw new Error("Error en el envío");

      setMensaje("");
      setEnviado(true);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-xl p-8">

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="/red-viva-logo.png"
            alt="Red Viva"
            className="h-16 w-auto"
          />
        </div>

        {/* TÍTULO */}
        <h1 className="text-2xl font-bold text-green-700 text-center mb-2">
          Reporte Diario del Cuidador
        </h1>

        {/* DESCRIPCIÓN */}
        <p className="text-slate-600 text-sm text-center mb-6">
          Puedes registrar observaciones como: estado de ánimo, alimentación,
          sueño, medicamentos, dolor, caídas o cualquier cambio que notes hoy.
        </p>

        {/* TIPO DE REPORTE */}
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-700 mb-2">
            Tipo de reporte
          </p>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value="diario"
                checked={tipoReporte === "diario"}
                onChange={() => setTipoReporte("diario")}
              />
              Reporte diario
            </label>

            <label className="flex items-center gap-2 text-sm text-red-700">
              <input
                type="radio"
                value="evento"
                checked={tipoReporte === "evento"}
                onChange={() => setTipoReporte("evento")}
              />
              Evento relevante
            </label>
          </div>
        </div>

        {/* TEXTAREA */}
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={5}
          placeholder={
            tipoReporte === "evento"
              ? "Describe con detalle el evento relevante ocurrido..."
              : "Observaciones generales del día (opcional)..."
          }
          className="w-full p-4 rounded-xl border border-slate-300 mb-4"
          required={tipoReporte === "evento"}
        />

        {/* BOTÓN */}
        <button
          onClick={handleSend}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Enviando..." : "Enviar reporte"}
        </button>

        {/* MENSAJES */}
        {enviado && (
          <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-xl text-sm">
            Reporte enviado correctamente. El equipo profesional revisará la
            información.
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-xl text-sm">
            Ocurrió un error al enviar el reporte.
          </div>
        )}

        {/* NOTA */}
        <p className="text-xs text-slate-400 text-center mt-4">
          Red Viva procesará este reporte y lo enviará al equipo profesional. No
          te preocupes por usar palabras técnicas.
        </p>
      </div>
    </div>
  );
}
