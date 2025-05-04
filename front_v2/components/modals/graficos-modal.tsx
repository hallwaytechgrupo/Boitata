"use client"

import { useState } from "react"
import Modal from "@/components/modal"
import { Download } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { firesByStateData, firesByBiomeData } from "@/lib/mock-data"

interface GraficosModalProps {
  onClose: () => void
}

export default function GraficosModal({ onClose }: GraficosModalProps) {
  const [dataType, setDataType] = useState("focos")
  const [dimension, setDimension] = useState("estado")

  const handleExport = () => {
    // Simulação de exportação de gráfico
    console.log("Exportando gráfico...")
    alert("Gráfico exportado com sucesso!")
  }

  // Seleciona os dados com base nas opções escolhidas
  const chartData = dimension === "estado" ? firesByStateData : firesByBiomeData
  const dataKey = dimension === "estado" ? "state" : "biome"
  const valueKey = dataType === "focos" ? "fires" : dataType === "risco" ? "risk" : "area"
  const chartTitle = `${dataType === "focos" ? "Focos de Calor" : dataType === "risco" ? "Risco de Fogo" : "Área Queimada"} por ${dimension === "estado" ? "Estado" : "Bioma"}`

  return (
    <Modal title="Gráficos" onClose={onClose}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="data-type" className="block text-sm font-medium text-gray-300">
              Tipo de Dado
            </label>
            <select
              id="data-type"
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="focos">Focos de Calor</option>
              <option value="risco">Risco de Fogo</option>
              <option value="area">Área Queimada</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="dimension" className="block text-sm font-medium text-gray-300">
              Dimensão
            </label>
            <select
              id="dimension"
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="estado">Por Estado</option>
              <option value="bioma">Por Bioma</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 h-[300px]">
          <h4 className="text-sm font-medium text-gray-300 mb-3 text-center">{chartTitle}</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={dataKey} stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#ff7300" }}
              />
              <Legend />
              <Bar
                dataKey={valueKey}
                name={dataType === "focos" ? "Focos" : dataType === "risco" ? "Risco" : "Área (km²)"}
                fill="#ff7300"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleExport}
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 mr-2"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PNG
          </button>
        </div>
      </div>
    </Modal>
  )
}
