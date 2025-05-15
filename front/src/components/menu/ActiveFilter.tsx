
import { useFilter } from '../../contexts/FilterContext'
import { FilterType } from '../../types'
import { FilterInfo, FilterPanel, FilterTitle } from '../../styles/styles'

export const ActiveFilter = () => {
  
  const { estado, cidade, bioma, filterType, dateRange } = useFilter()
  // Verificar se há filtros ativos
  const hasActiveFilters = filterType !== FilterType.NONE || !!(dateRange.startDate && dateRange.endDate)

  // Construir texto do filtro para o painel
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
  } else {
    filterText += filterText
      ? ", Período: últimos 14 dias"
      : "Período: últimos 14 dias"
  }

  return (
    <>      
        {/* Painel de filtros ativos */}
      {hasActiveFilters && (
        <FilterPanel>
          <FilterTitle>Filtros ativos</FilterTitle>
          <FilterInfo>{filterText}</FilterInfo>
        </FilterPanel>
      )}
    </>
  )
}

