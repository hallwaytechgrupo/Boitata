"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type FilterRegion = "" | "brasil" | "amazonia" | "cerrado" | "pantanal" | "caatinga" | "mata-atlantica" | "pampa"
export type FilterState = string
export type FilterCity = string
export type FilterBiome = FilterRegion
export type FilterDateRange = {
  startDate: string
  endDate: string
}

interface FilterContextType {
  region: FilterRegion
  state: FilterState
  city: FilterCity
  biome: FilterBiome
  dateRange: FilterDateRange
  setRegion: (region: FilterRegion) => void
  setState: (state: FilterState) => void
  setCity: (city: FilterCity) => void
  setBiome: (biome: FilterBiome) => void
  setDateRange: (dateRange: FilterDateRange) => void
  resetFilters: () => void
  hasActiveFilters: boolean
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState<FilterRegion>("")
  const [state, setState] = useState<FilterState>("")
  const [city, setCity] = useState<FilterCity>("")
  const [biome, setBiome] = useState<FilterBiome>("")
  const [dateRange, setDateRange] = useState<FilterDateRange>({
    startDate: "",
    endDate: "",
  })

  const resetFilters = () => {
    setRegion("")
    setState("")
    setCity("")
    setBiome("")
    setDateRange({ startDate: "", endDate: "" })
  }

  const hasActiveFilters = !!(region || state || city || biome || dateRange.startDate || dateRange.endDate)

  return (
    <FilterContext.Provider
      value={{
        region,
        state,
        city,
        biome,
        dateRange,
        setRegion,
        setState,
        setCity,
        setBiome,
        setDateRange,
        resetFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}
