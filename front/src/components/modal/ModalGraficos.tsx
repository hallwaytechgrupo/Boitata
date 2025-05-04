"use client"

import { useState } from "react"
import styled from "styled-components"
import { Download } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import ModalBase from "./ModalBase"
import { firesByBiomeData, firesByStateData } from "../../utils/mock"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const FilterLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #D1D5DB;
`

const FilterSelect = styled.select`
  width: 100%;
  background-color: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.8);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  color: white;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
  }
`

const ChartContainer = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 1rem;
  height: 300px;
`

const ChartTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: #D1D5DB;
  margin-bottom: 0.75rem;
  text-align: center;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  background-color: rgba(55, 65, 81, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  transition: background-color 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(75, 85, 99, 0.8);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
    outline-offset: 2px;
  }
  
  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
`

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
