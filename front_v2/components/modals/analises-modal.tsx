"use client"
import { useState } from "react"
import Modal from "@/components/modal"
import { Download } from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ScatterChart,
  Scatter,
} from "recharts"
import { monthlyFireRiskData, riskVsBurnedAreaData } from "@/lib/mock-data"

interface AnalisesModalProps {
  onClose: () => void
}

export default function AnalisesModal({ onClose }: AnalisesModalProps) {
  const [chartImage, setChartImage] = useState<string | null>(null)

  const handleExport = (section: string) => {
    // Simulação de exportação de gráfico
    console.log(`Exportando gráfico da seção ${section}...`)
    alert(`Gráfico de ${section} exportado com sucesso!`)
  }

  return (
    <Modal title="Análises" onClose={onClose}>
      <div className="space-y-8">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white">Meses com maior risco de fogo</h4>
          <div className="bg-gray-800 rounded-lg p-4 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFireRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="month" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#ff7300" }}
                />
                <Bar dataKey="risk" fill="#ff7300" name="Risco de Fogo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handleExport("risco")}
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Download className="w-3 h-3 mr-1" />
              Exportar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-white">Risco de fogo vs. Área queimada</h4>
          <div className="bg-gray-800 rounded-lg p-4 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  type="number"
                  dataKey="risk"
                  name="Risco de Fogo"
                  unit="%"
                  stroke="#999"
                  label={{ value: "Risco de Fogo (%)", position: "insideBottom", offset: -10, fill: "#999" }}
                />
                <YAxis
                  type="number"
                  dataKey="area"
                  name="Área Queimada"
                  unit=" km²"
                  dataKey="area"
                  name="Área Queimada"
                  unit=" km²"
                  stroke="#999"
                  label={{ value: "Área Queimada (km²)", angle: -90, position: "insideLeft", offset: -5, fill: "#999" }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Scatter name="Estados" data={riskVsBurnedAreaData} fill="#ff7300" shape="circle" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handleExport("correlacao")}
              className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Download className="w-3 h-3 mr-1" />
              Exportar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
