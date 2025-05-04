"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import Modal from "@/components/modal"
import { useFilter } from "@/contexts/filter-context"

const FilterInfo = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
`

const FilterTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.5rem;
`

const FilterText = styled.div`
  font-size: 0.75rem;
  color: rgb(156, 163, 175);
`

const ResultsContainer = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 1rem;
`

const ResultsTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.5rem;
`

const TableContainer = styled.div`
  overflow-x: auto;
`

const Table = styled.table`
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`

const TableHead = styled.thead`
  border-bottom: 1px solid rgba(75, 85, 99, 0.5);
`

const TableHeader = styled.th`
  padding: 0.5rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(156, 163, 175);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const TableBody = styled.tbody`
  & > tr:not(:last-child) {
    border-bottom: 1px solid rgba(75, 85, 99, 0.3);
  }
`

const TableCell = styled.td`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: rgb(209, 213, 219);
`

const QuantityCell = styled(TableCell)`
  color: rgb(239, 68, 68);
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
`

const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid rgba(22, 163, 74, 0.3);
  border-top-color: rgb(22, 163, 74);
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`

const ApplyButton = styled.button`
  background-color: rgba(22, 163, 74, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(22, 163, 74, 0.9);
  }
  
  &:focus {
    outline: none;
  }
`

interface FocosModalProps {
  onClose: () => void
}

export default function FocosModal({ onClose }: FocosModalProps) {
  const { region, state, city, biome, dateRange } = useFilter()
  const [loading, setLoading] = useState(false)

  // Dados mock filtrados com base no contexto de filtros
  const getFocosData = () => {
    // Aqui você implementaria a lógica real para filtrar os dados
    // Este é apenas um exemplo simplificado

    // Dados base
    const baseData = [
      { location: "Amazônia", date: "01/04/2023", quantity: 1245 },
      { location: "Cerrado", date: "01/04/2023", quantity: 876 },
      { location: "Pantanal", date: "01/04/2023", quantity: 432 },
      { location: "Caatinga", date: "01/04/2023", quantity: 215 },
      { location: "Mata Atlântica", date: "01/04/2023", quantity: 124 },
      { location: "Pampa", date: "01/04/2023", quantity: 67 },
    ]

    // Filtrar por bioma
    if (biome) {
      return baseData.filter((item) => item.location.toLowerCase() === biome.toLowerCase())
    }

    // Filtrar por estado
    if (state) {
      // Simulação - na prática, isso viria de uma API
      if (state === "São Paulo") {
        return [
          { location: "São Paulo", date: "01/04/2023", quantity: 124 },
          { location: "Mata Atlântica", date: "01/04/2023", quantity: 124 },
        ]
      } else if (state === "Mato Grosso") {
        return [
          { location: "Mato Grosso", date: "01/04/2023", quantity: 876 },
          { location: "Pantanal", date: "01/04/2023", quantity: 432 },
          { location: "Cerrado", date: "01/04/2023", quantity: 876 },
        ]
      }
    }

    return baseData
  }

  const handleApply = () => {
    // Simular a visualização no mapa
    console.log("Visualizando focos de calor no mapa")
    onClose()
  }

  // Simular carregamento de dados quando os filtros mudam
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [region, state, city, biome, dateRange])

  const focosData = getFocosData()

  return (
    <Modal title="Focos de Calor" onClose={onClose}>
      {/* Exibir filtros ativos */}
      <FilterInfo>
        <FilterTitle>Filtros Aplicados:</FilterTitle>
        <FilterText>
          {state ? `Estado: ${state}` : ""}
          {city ? `, Município: ${city}` : ""}
          {biome ? `, Bioma: ${biome}` : ""}
          {dateRange.startDate && dateRange.endDate ? `, Período: ${dateRange.startDate} a ${dateRange.endDate}` : ""}
          {!state && !city && !biome && !dateRange.startDate && !dateRange.endDate ? "Nenhum filtro aplicado" : ""}
        </FilterText>
      </FilterInfo>

      <ResultsContainer>
        <ResultsTitle>Resultados</ResultsTitle>
        <TableContainer>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : (
            <Table>
              <TableHead>
                <tr>
                  <TableHeader>Localização</TableHeader>
                  <TableHeader>Data</TableHeader>
                  <TableHeader>Quantidade</TableHeader>
                </tr>
              </TableHead>
              <TableBody>
                {focosData.map((item, index) => (
                  <tr key={index}>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <QuantityCell>{item.quantity.toLocaleString()}</QuantityCell>
                  </tr>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </ResultsContainer>

      <ButtonContainer>
        <ApplyButton onClick={handleApply}>Visualizar no Mapa</ApplyButton>
      </ButtonContainer>
    </Modal>
  )
}
