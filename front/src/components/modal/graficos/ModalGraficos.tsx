import { useState } from "react"
import { Download } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import ModalBase from "../_base/ModalBase"
import { firesByBiomeData, firesByStateData } from "../../../utils/mock"
import { Container, FilterGrid, FilterGroup, FilterLabel, FilterSelect, ChartContainer, ChartTitle, ButtonContainer, ExportButton } from './graficos-stylex'

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
    <ModalBase title="Gráficos" onClose={onClose}>
      <Container>
        <FilterGrid>
          <FilterGroup>
            <FilterLabel htmlFor="data-type">Tipo de Dado</FilterLabel>
            <FilterSelect id="data-type" value={dataType} onChange={(e) => setDataType(e.target.value)}>
              <option value="focos">Focos de Calor</option>
              <option value="risco">Risco de Fogo</option>
              <option value="area">Área Queimada</option>
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel htmlFor="dimension">Dimensão</FilterLabel>
            <FilterSelect id="dimension" value={dimension} onChange={(e) => setDimension(e.target.value)}>
              <option value="estado">Por Estado</option>
              <option value="bioma">Por Bioma</option>
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>

        <ChartContainer>
          <ChartTitle>{chartTitle}</ChartTitle>
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
        </ChartContainer>

        <ButtonContainer>
          <ExportButton onClick={handleExport}>
            <Download />
            Exportar PNG
          </ExportButton>
        </ButtonContainer>
      </Container>
    </ModalBase>
  )
}
