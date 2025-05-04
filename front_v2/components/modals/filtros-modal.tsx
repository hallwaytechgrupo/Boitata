"use client"
import { useState } from "react"
import styled from "styled-components"
import Modal from "@/components/modal"
import { useFilter } from "@/contexts/filter-context"
import { X } from "lucide-react"

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(75, 85, 99, 0.5);
  margin-bottom: 1.5rem;
`

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  color: ${(props) => (props.$isActive ? "white" : "rgba(209, 213, 219, 0.8)")};
  border-bottom: 2px solid ${(props) => (props.$isActive ? "rgb(255, 115, 0)" : "transparent")};
  background-color: transparent;
  transition: all 0.2s;
  
  &:hover {
    color: white;
  }
  
  &:focus {
    outline: none;
  }
`

const FilterContainer = styled.div`
  margin-bottom: 1.5rem;
`

const FilterLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.5rem;
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
    box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
  }
`

const FilterInput = styled.input`
  width: 100%;
  background-color: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.8);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  color: white;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.5);
  }
`

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`

const ActiveFiltersContainer = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
`

const ActiveFiltersTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.5rem;
`

const ActiveFiltersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const ActiveFilterTag = styled.div`
  background-color: rgba(55, 65, 81, 0.8);
  color: rgb(209, 213, 219);
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
`

const RemoveFilterButton = styled.button`
  margin-left: 0.25rem;
  color: rgba(156, 163, 175, 0.8);
  
  &:hover {
    color: white;
  }
  
  &:focus {
    outline: none;
  }
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
  }
`

const ResetButton = styled(Button)`
  background-color: rgba(75, 85, 99, 0.8);
  color: white;
  
  &:hover {
    background-color: rgba(55, 65, 81, 0.8);
  }
`

const ApplyButton = styled(Button)`
  background-color: rgba(22, 163, 74, 0.8);
  color: white;
  
  &:hover {
    background-color: rgba(22, 163, 74, 0.9);
  }
`

interface FiltrosModalProps {
  onClose: () => void
}

export default function FiltrosModal({ onClose }: FiltrosModalProps) {
  const {
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
  } = useFilter()

  const [activeTab, setActiveTab] = useState<"estado" | "bioma">("estado")
  const [tempStartDate, setTempStartDate] = useState(dateRange.startDate)
  const [tempEndDate, setTempEndDate] = useState(dateRange.endDate)

  // Lista de estados (mock)
  const estados = [
    "Acre",
    "Alagoas",
    "Amapá",
    "Amazonas",
    "Bahia",
    "Ceará",
    "Distrito Federal",
    "Espírito Santo",
    "Goiás",
    "Maranhão",
    "Mato Grosso",
    "Mato Grosso do Sul",
    "Minas Gerais",
    "Pará",
    "Paraíba",
    "Paraná",
    "Pernambuco",
    "Piauí",
    "Rio de Janeiro",
    "Rio Grande do Norte",
    "Rio Grande do Sul",
    "Rondônia",
    "Roraima",
    "Santa Catarina",
    "São Paulo",
    "Sergipe",
    "Tocantins",
  ]

  // Lista de biomas (mock)
  const biomas = ["Amazônia", "Cerrado", "Caatinga", "Mata Atlântica", "Pampa", "Pantanal"]

  // Lista de municípios (mock - depende do estado selecionado)
  const getMunicipios = (estado: string) => {
    // Simulação - na prática, isso viria de uma API
    if (estado === "São Paulo") {
      return ["São Paulo", "Campinas", "Santos", "Ribeirão Preto", "São José dos Campos"]
    } else if (estado === "Rio de Janeiro") {
      return ["Rio de Janeiro", "Niterói", "Petrópolis", "Angra dos Reis", "Cabo Frio"]
    } else {
      return ["Município 1", "Município 2", "Município 3"]
    }
  }

  const handleApplyFilter = () => {
    // Aplicar filtro de data
    setDateRange({
      startDate: tempStartDate,
      endDate: tempEndDate,
    })

    onClose()
  }

  return (
    <Modal title="Filtros" onClose={onClose}>
      {/* Exibir filtros ativos */}
      {hasActiveFilters && (
        <ActiveFiltersContainer>
          <ActiveFiltersTitle>Filtros Ativos:</ActiveFiltersTitle>
          <ActiveFiltersList>
            {state && (
              <ActiveFilterTag>
                Estado: {state}
                <RemoveFilterButton onClick={() => setState("")}>
                  <X size={12} />
                </RemoveFilterButton>
              </ActiveFilterTag>
            )}
            {city && (
              <ActiveFilterTag>
                Município: {city}
                <RemoveFilterButton onClick={() => setCity("")}>
                  <X size={12} />
                </RemoveFilterButton>
              </ActiveFilterTag>
            )}
            {biome && (
              <ActiveFilterTag>
                Bioma: {biome}
                <RemoveFilterButton onClick={() => setBiome("")}>
                  <X size={12} />
                </RemoveFilterButton>
              </ActiveFilterTag>
            )}
            {dateRange.startDate && dateRange.endDate && (
              <ActiveFilterTag>
                Período: {dateRange.startDate} a {dateRange.endDate}
                <RemoveFilterButton onClick={() => setDateRange({ startDate: "", endDate: "" })}>
                  <X size={12} />
                </RemoveFilterButton>
              </ActiveFilterTag>
            )}
          </ActiveFiltersList>
        </ActiveFiltersContainer>
      )}

      {/* Abas */}
      <TabsContainer>
        <Tab onClick={() => setActiveTab("estado")} $isActive={activeTab === "estado"}>
          Estado
        </Tab>
        <Tab onClick={() => setActiveTab("bioma")} $isActive={activeTab === "bioma"}>
          Bioma
        </Tab>
      </TabsContainer>

      {/* Conteúdo da aba Estado */}
      {activeTab === "estado" && (
        <>
          <FilterContainer>
            <FilterLabel htmlFor="estado">Estado</FilterLabel>
            <FilterSelect id="estado" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Selecione um estado</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </FilterSelect>
          </FilterContainer>

          <FilterContainer>
            <FilterLabel htmlFor="municipio">Município</FilterLabel>
            <FilterSelect id="municipio" value={city} onChange={(e) => setCity(e.target.value)} disabled={!state}>
              <option value="">Selecione um município</option>
              {state &&
                getMunicipios(state).map((municipio) => (
                  <option key={municipio} value={municipio}>
                    {municipio}
                  </option>
                ))}
            </FilterSelect>
          </FilterContainer>
        </>
      )}

      {/* Conteúdo da aba Bioma */}
      {activeTab === "bioma" && (
        <FilterContainer>
          <FilterLabel htmlFor="bioma">Bioma</FilterLabel>
          <FilterSelect id="bioma" value={biome} onChange={(e) => setBiome(e.target.value)}>
            <option value="">Selecione um bioma</option>
            {biomas.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </FilterSelect>
        </FilterContainer>
      )}

      {/* Campos de data (comuns a todas as abas) */}
      <FilterGrid>
        <FilterContainer>
          <FilterLabel htmlFor="start-date">Data Inicial</FilterLabel>
          <FilterInput
            type="date"
            id="start-date"
            value={tempStartDate}
            onChange={(e) => setTempStartDate(e.target.value)}
          />
        </FilterContainer>
        <FilterContainer>
          <FilterLabel htmlFor="end-date">Data Final</FilterLabel>
          <FilterInput type="date" id="end-date" value={tempEndDate} onChange={(e) => setTempEndDate(e.target.value)} />
        </FilterContainer>
      </FilterGrid>

      <ButtonsContainer>
        <ResetButton onClick={resetFilters}>Limpar Filtros</ResetButton>
        <ApplyButton onClick={handleApplyFilter}>Aplicar Filtro</ApplyButton>
      </ButtonsContainer>
    </Modal>
  )
}
