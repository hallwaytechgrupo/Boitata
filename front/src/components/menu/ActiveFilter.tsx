import { useFilter } from '../../contexts/FilterContext'
import { FilterType, PatternType } from '../../types'
import { FilterInfo, FilterPanel, FilterTitle } from '../../styles/styles'


export const ActiveFilter = () => {
  
  const { estado, cidade, bioma, filterType, dateRange, patternType } = useFilter()
  // Verificar se há filtros ativos
  const hasActiveFilters = filterType !== FilterType.NONE || !!(dateRange.startDate && dateRange.endDate) || !!patternType

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

  // Adicionar informação do tipo de visualização (patternType)
  if (patternType) {
    const patternTypeText = patternType === PatternType.HEAT_MAP 
      ? "Focos de Calor"
      : patternType === PatternType.QUEIMADA 
        ? "Área Queimada" 
        : "Risco de Fogo";
    
    filterText += filterText
      ? `, Visualização: ${patternTypeText}`
      : `Visualização: ${patternTypeText}`;
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

