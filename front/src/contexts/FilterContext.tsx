import { createContext, useContext, useState, type ReactNode } from "react"
import { FilterType, type LocationType } from "../types"

interface FilterContextType {
  estado: LocationType | null
  cidade: LocationType | null
  bioma: LocationType | null
  filterType: FilterType
  setEstado: (estado: LocationType) => void
  setCidade: (cidade: LocationType) => void
  setBioma: (bioma: LocationType) => void
  setFilterType: (type: FilterType) => void
  resetFilters: () => void
  hasActiveFilters: boolean
  dateRange: {
    startDate: string
    endDate: string
  }
  setDateRange: (dateRange: { startDate: string; endDate: string }) => void
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
  const setEstado = (estado: LocationType) => {
    setEstadoState(estado)
    setCidadeState(null)
    setBiomaState(null)
    setFilterType(FilterType.ESTADO)
  }

  const setCidade = (cidade: LocationType) => {
    setCidadeState(cidade)
    setBiomaState(null)
    setFilterType(FilterType.MUNICIPIO)
  }

  const setBioma = (bioma: LocationType) => {
    setBiomaState(bioma)
    setEstadoState(null)
    setCidadeState(null)
    setFilterType(FilterType.BIOMA)
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
