import { useState } from "react"
import Modal from '../_base/ModalBase'
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
import { monthlyFireRiskData, riskVsBurnedAreaData } from '../../../utils/mock'
import { Container, Section, SectionTitle, ChartContainer, ButtonContainer, ExportButton } from './analises-styled'

interface AnalisesModalProps {
  onClose: () => void
}

export default function ModalAnalises({ onClose }: AnalisesModalProps) {
  const [chartImage, setChartImage] = useState<string | null>(null)

  const handleExport = (section: string) => {
    // Simulação de exportação de gráfico
    console.log(`Exportando gráfico da seção ${section}...`)
    alert(`Gráfico de ${section} exportado com sucesso!`)
  }

  return (
    <Modal title="Análises" onClose={onClose}>
      <Container>
        <Section>
          <SectionTitle>Meses com maior risco de fogo</SectionTitle>
          <ChartContainer>
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
          </ChartContainer>
          <ButtonContainer>
            <ExportButton onClick={() => handleExport("risco")}>
              <Download />
              Exportar
            </ExportButton>
          </ButtonContainer>
        </Section>

        <Section>
          <SectionTitle>Risco de fogo vs. Área queimada</SectionTitle>
          <ChartContainer>
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
          </ChartContainer>
          <ButtonContainer>
            <ExportButton onClick={() => handleExport("correlacao")}>
              <Download />
              Exportar
            </ExportButton>
          </ButtonContainer>
        </Section>
      </Container>
    </Modal>
  )
}
