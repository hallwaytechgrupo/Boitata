import { createContext, useContext, useState, type ReactNode } from "react"
import { FilterType, type LocationType } from "../types"

interface FilterContextType {
  // Dados de localização
  estado: LocationType | null
  cidade: LocationType | null
  bioma: LocationType | null
  filterType: FilterType
  
  // Funções para definir localização
  setEstado: (estado: LocationType | null) => void
  setCidade: (cidade: LocationType | null) => void
  setBioma: (bioma: LocationType | null) => void
  setFilterType: (type: FilterType) => void
  
  // Período de datas
  dateRange: {
    startDate: string
    endDate: string
  }
  setDateRange: (dateRange: { startDate: string; endDate: string }) => void
  
  // Funções de utilidade
  resetFilters: () => void
  hasActiveFilters: boolean
  
  // Opção para comportamento diferente (para compatibilidade com código existente)
  setEstadoSimple?: (estado: LocationType | null) => void
  setCidadeSimple?: (cidade: LocationType | null) => void
  setBiomaSimple?: (bioma: LocationType | null) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [estado, setEstadoState] = useState<LocationType | null>(null)
  const [cidade, setCidadeState] = useState<LocationType | null>(null)
  const [bioma, setBiomaState] = useState<LocationType | null>(null)
  const [filterType, setFilterType] = useState<FilterType>(FilterType.NONE)
  const [dateRange, setDateRange] = useState<{
    startDate: string
    endDate: string
  }>({
    startDate: "",
    endDate: "",
  })

  // Funções para definir filtros com lógica para garantir que apenas um tipo esteja ativo
  const setEstado = (estado: LocationType | null) => {
    setEstadoState(estado)
    setCidadeState(null)
    setBiomaState(null)
    setFilterType(estado ? FilterType.ESTADO : FilterType.NONE)
  }

  const setCidade = (cidade: LocationType | null) => {
    setCidadeState(cidade)
    setBiomaState(null)
    setFilterType(cidade ? FilterType.MUNICIPIO : FilterType.NONE)
  }

  const setBioma = (bioma: LocationType | null) => {
    setBiomaState(bioma)
    setEstadoState(null)
    setCidadeState(null)
    setFilterType(bioma ? FilterType.BIOMA : FilterType.NONE)
  }
  
  // Funções simples (equivalentes ao LocationContext original)
  const setEstadoSimple = (estado: LocationType | null) => {
    setEstadoState(estado)
  }
  
  const setCidadeSimple = (cidade: LocationType | null) => {
    setCidadeState(cidade)
  }
  
  const setBiomaSimple = (bioma: LocationType | null) => {
    setBiomaState(bioma)
  }

  const resetFilters = () => {
    setEstadoState(null)
    setCidadeState(null)
    setBiomaState(null)
    setFilterType(FilterType.NONE)
    setDateRange({ startDate: "", endDate: "" })
  }

  // Verificar se há algum filtro ativo
  const hasActiveFilters = filterType !== FilterType.NONE || !!(dateRange.startDate && dateRange.endDate)

  return (
    <FilterContext.Provider
      value={{
        estado,
        cidade,
        bioma,
        filterType,
        setEstado,
        setCidade,
        setBioma,
        setFilterType,
        resetFilters,
        hasActiveFilters,
        dateRange,
        setDateRange,
        
        // Adicionando as funções simples para compatibilidade
        setEstadoSimple,
        setCidadeSimple,
        setBiomaSimple,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}

// Adicionar um alias para compatibilidade com código existente
export const useLocation = useFilter;