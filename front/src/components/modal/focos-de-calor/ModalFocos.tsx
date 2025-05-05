import { useState, useEffect } from "react"
import Modal from '../_base/ModalBase'
import { useFilter } from '../../../contexts/FilterContext'
import { FilterType } from '../../../types'
import { FilterInfo, FilterTitle, FilterText, ResultsContainer, ResultsTitle, TableContainer, Table, TableHead, TableHeader, TableBody, TableCell, QuantityCell, LoadingContainer, LoadingSpinner, ButtonContainer, ApplyButton } from './focos-styled'

interface FocosModalProps {
  onClose: () => void
}

export default function ModalFocos({ onClose }: FocosModalProps) {
  const { estado, cidade, bioma, filterType, dateRange } = useFilter()
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
    if (filterType === FilterType.BIOMA && bioma) {
      return baseData.filter((item) => item.location.toLowerCase() === bioma.nome.toLowerCase())
    }

    // Filtrar por estado
    if (filterType === FilterType.ESTADO && estado) {
      // Simulação - na prática, isso viria de uma API
      if (estado.nome === "São Paulo") {
        return [
          { location: "São Paulo", date: "01/04/2023", quantity: 124 },
          { location: "Mata Atlântica", date: "01/04/2023", quantity: 124 },
        ]
      } if (estado.nome === "Mato Grosso") {
        return [
          { location: "Mato Grosso", date: "01/04/2023", quantity: 876 },
          { location: "Pantanal", date: "01/04/2023", quantity: 432 },
          { location: "Cerrado", date: "01/04/2023", quantity: 876 },
        ]
      }
    }

    // Filtrar por município
    if (filterType === FilterType.MUNICIPIO && cidade) {
      return [{ location: cidade.nome, date: "01/04/2023", quantity: 42 }]
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
  }, [filterType, estado, cidade, bioma, dateRange])

  const focosData = getFocosData()

  // Construir texto do filtro
  let filterText = ""

  switch (filterType) {
    case FilterType.ESTADO:
      filterText = `Estado: ${estado?.nome || ""}`
      break
    case FilterType.MUNICIPIO:
      filterText = `Município: ${cidade?.nome || ""}`
      break
    case FilterType.BIOMA:
      filterText = `Bioma: ${bioma?.nome || ""}`
      break
  }

  if (dateRange.startDate && dateRange.endDate) {
    filterText += filterText
      ? `, Período: ${dateRange.startDate} a ${dateRange.endDate}`
      : `Período: ${dateRange.startDate} a ${dateRange.endDate}`
  }

  return (
    <Modal title="Focos de Calor" onClose={onClose}>
      {/* Exibir filtros ativos */}
      {filterText && (
        <FilterInfo>
          <FilterTitle>Filtros Aplicados:</FilterTitle>
          <FilterText>{filterText}</FilterText>
        </FilterInfo>
      )}

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
