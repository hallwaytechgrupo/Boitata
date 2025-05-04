"use client"

import type React from "react"

import { useState } from "react"
import styled from "styled-components"
import { X, FilterIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ModalBase from "./ModalBase"
import { useFilter } from "../../contexts/FilterContext"
import  { FilterType, type Location } from "../../types"


const TabsContainer = styled(motion.div)`
  display: flex;
  border-bottom: 1px solid rgba(75, 85, 99, 0.5);
  margin-bottom: 1.5rem;
`

const Tab = styled(motion.button)<{ $isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  color: ${(props) => (props.$isActive ? "white" : "rgba(209, 213, 219, 0.8)")};
  border-bottom: 2px solid ${(props) => (props.$isActive ? "#FF7300" : "transparent")};
  background-color: transparent;
  border-left: none;
  border-right: none;
  border-top: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: white;
  }
  
  &:focus {
    outline: none;
  }
`

const FilterContainer = styled(motion.div)`
  margin-bottom: 1.5rem;
`

const FilterLabel = styled(motion.label)`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #FF7300;
  margin-bottom: 0.5rem;
`

const FilterSelect = styled(motion.select)`
  width: 100%;
  background: rgba(31, 41, 55, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  color: white;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 115, 0, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
  }
`

const FilterInput = styled(motion.input)`
  width: 100%;
  background: rgba(31, 41, 55, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  color: white;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 115, 0, 0.5);
  }
`

const FilterGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`

const ActiveFiltersContainer = styled(motion.div)`
  background: rgba(31, 41, 55, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
`

const ActiveFiltersTitle = styled(motion.h4)`
  font-size: 0.875rem;
  font-weight: 500;
  color: #FF7300;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`

const ActiveFiltersList = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const ActiveFilterTag = styled(motion.div)`
  background: rgba(55, 65, 81, 0.8);
  color: #E5E7EB;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
`

const RemoveFilterButton = styled(motion.button)`
  margin-left: 0.25rem;
  color: rgba(156, 163, 175, 0.8);
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
  
  &:focus {
    outline: none;
  }
`

const ButtonsContainer = styled(motion.div)`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`

const Button = styled(motion.button)<{ $primary?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  
  &:focus {
    outline: none;
  }
`

const ResetButton = styled(Button)`
  background: rgba(75, 85, 99, 0.8);
  color: white;
  
  &:hover {
    background: rgba(55, 65, 81, 0.8);
  }
`

const ApplyButton = styled(Button)`
  background: #FF7300;
  color: white;
  
  &:hover {
    background: #EF4444;
  }
`

interface FiltrosModalProps {
  onClose: () => void
}

const ModalFiltro = ({ onClose }: FiltrosModalProps) => {
  const {
    estado,
    cidade,
    bioma,
    filterType,
    dateRange,
    setEstado,
    setCidade,
    setBioma,
    setFilterType,
    setDateRange,
    resetFilters,
    hasActiveFilters,
  } = useFilter()

  const [activeTab, setActiveTab] = useState<"estado" | "bioma">(filterType === FilterType.BIOMA ? "bioma" : "estado")
  const [tempStartDate, setTempStartDate] = useState(dateRange.startDate)
  const [tempEndDate, setTempEndDate] = useState(dateRange.endDate)

  // Lista de estados (mock)
  const estados: Location[] = [
    { id: 1, nome: "Acre" },
    { id: 2, nome: "Alagoas" },
    { id: 3, nome: "Amapá" },
    { id: 4, nome: "Amazonas" },
    { id: 5, nome: "Bahia" },
    { id: 6, nome: "Ceará" },
    { id: 7, nome: "Distrito Federal" },
    { id: 8, nome: "Espírito Santo" },
    { id: 9, nome: "Goiás" },
    { id: 10, nome: "Maranhão" },
    { id: 11, nome: "Mato Grosso" },
    { id: 12, nome: "Mato Grosso do Sul" },
    { id: 13, nome: "Minas Gerais" },
    { id: 14, nome: "Pará" },
    { id: 15, nome: "Paraíba" },
    { id: 16, nome: "Paraná" },
    { id: 17, nome: "Pernambuco" },
    { id: 18, nome: "Piauí" },
    { id: 19, nome: "Rio de Janeiro" },
    { id: 20, nome: "Rio Grande do Norte" },
    { id: 21, nome: "Rio Grande do Sul" },
    { id: 22, nome: "Rondônia" },
    { id: 23, nome: "Roraima" },
    { id: 24, nome: "Santa Catarina" },
    { id: 25, nome: "São Paulo" },
    { id: 26, nome: "Sergipe" },
    { id: 27, nome: "Tocantins" },
  ]

  // Lista de biomas (mock)
  const biomas: Location[] = [
    { id: 1, nome: "Amazônia" },
    { id: 2, nome: "Cerrado" },
    { id: 3, nome: "Caatinga" },
    { id: 4, nome: "Mata Atlântica" },
    { id: 5, nome: "Pampa" },
    { id: 6, nome: "Pantanal" },
  ]

  // Lista de municípios (mock - depende do estado selecionado)
  const getMunicipios = (estadoId: number): Location[] => {
    // Simulação - na prática, isso viria de uma API
    if (estadoId === 25) {
      // São Paulo
      return [
        { id: 1, nome: "São Paulo" },
        { id: 2, nome: "Campinas" },
        { id: 3, nome: "Santos" },
        { id: 4, nome: "Ribeirão Preto" },
        { id: 5, nome: "São José dos Campos" },
      ]
    } if (estadoId === 19) {
      // Rio de Janeiro
      return [
        { id: 1, nome: "Rio de Janeiro" },
        { id: 2, nome: "Niterói" },
        { id: 3, nome: "Petrópolis" },
        { id: 4, nome: "Angra dos Reis" },
        { id: 5, nome: "Cabo Frio" },
      ]
    } 
      return [
        { id: 1, nome: "Município 1" },
        { id: 2, nome: "Município 2" },
        { id: 3, nome: "Município 3" },
      ]
  }

  const handleApplyFilter = () => {
    // Aplicar filtro de data
    setDateRange({
      startDate: tempStartDate,
      endDate: tempEndDate,
    })

    onClose()
  }

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number.parseInt(e.target.value)
    if (selectedId) {
      const selectedEstado = estados.find((e) => e.id === selectedId)
      if (selectedEstado) {
        setEstado(selectedEstado)
      }
    } else {
      setFilterType(FilterType.NONE)
    }
  }

  const handleCidadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number.parseInt(e.target.value)
    if (selectedId && estado) {
      const selectedCidade = getMunicipios(estado.id).find((c) => c.id === selectedId)
      if (selectedCidade) {
        setCidade(selectedCidade)
      }
    }
  }

  const handleBiomaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number.parseInt(e.target.value)
    if (selectedId) {
      const selectedBioma = biomas.find((b) => b.id === selectedId)
      if (selectedBioma) {
        setBioma(selectedBioma)
      }
    } else {
      setFilterType(FilterType.NONE)
    }
  }

  return (
    <ModalBase title="Filtros" onClose={onClose}>
      {/* Exibir filtros ativos */}
      <AnimatePresence>
        {hasActiveFilters && (
          <ActiveFiltersContainer
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveFiltersTitle>
              <FilterIcon size={16} color="#FF7300" />
              Filtros Ativos
            </ActiveFiltersTitle>
            <ActiveFiltersList>
              {estado && filterType === FilterType.ESTADO && (
                <ActiveFilterTag
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Estado: {estado.nome}
                  <RemoveFilterButton
                    onClick={() => setFilterType(FilterType.NONE)}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={12} />
                  </RemoveFilterButton>
                </ActiveFilterTag>
              )}
              {cidade && filterType === FilterType.MUNICIPIO && (
                <ActiveFilterTag
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Município: {cidade.nome}
                  <RemoveFilterButton
                    onClick={() => setFilterType(FilterType.NONE)}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={12} />
                  </RemoveFilterButton>
                </ActiveFilterTag>
              )}
              {bioma && filterType === FilterType.BIOMA && (
                <ActiveFilterTag
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Bioma: {bioma.nome}
                  <RemoveFilterButton
                    onClick={() => setFilterType(FilterType.NONE)}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={12} />
                  </RemoveFilterButton>
                </ActiveFilterTag>
              )}
              {dateRange.startDate && dateRange.endDate && (
                <ActiveFilterTag
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Período: {dateRange.startDate} a {dateRange.endDate}
                  <RemoveFilterButton
                    onClick={() => setDateRange({ startDate: "", endDate: "" })}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={12} />
                  </RemoveFilterButton>
                </ActiveFilterTag>
              )}
            </ActiveFiltersList>
          </ActiveFiltersContainer>
        )}
      </AnimatePresence>

      {/* Abas */}
      <TabsContainer>
        <Tab
          onClick={() => setActiveTab("estado")}
          $isActive={activeTab === "estado"}
          whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          Estado
        </Tab>
        <Tab
          onClick={() => setActiveTab("bioma")}
          $isActive={activeTab === "bioma"}
          whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          Bioma
        </Tab>
      </TabsContainer>

      {/* Conteúdo da aba Estado */}
      <AnimatePresence mode="wait">
        {activeTab === "estado" && (
          <motion.div
            key="estado-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <FilterContainer>
              <FilterLabel>Estado</FilterLabel>
              <FilterSelect value={estado?.id || ""} onChange={handleEstadoChange}>
                <option value="">Selecione um estado</option>
                {estados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome}
                  </option>
                ))}
              </FilterSelect>
            </FilterContainer>

            <FilterContainer>
              <FilterLabel>Município</FilterLabel>
              <FilterSelect value={cidade?.id || ""} onChange={handleCidadeChange} disabled={!estado}>
                <option value="">Selecione um município</option>
                {estado &&
                  getMunicipios(estado.id).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
              </FilterSelect>
            </FilterContainer>
          </motion.div>
        )}

        {/* Conteúdo da aba Bioma */}
        {activeTab === "bioma" && (
          <motion.div
            key="bioma-tab"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <FilterContainer>
              <FilterLabel>Bioma</FilterLabel>
              <FilterSelect value={bioma?.id || ""} onChange={handleBiomaChange}>
                <option value="">Selecione um bioma</option>
                {biomas.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
              </FilterSelect>
            </FilterContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campos de data (comuns a todas as abas) */}
      <FilterGrid initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <FilterContainer>
          <FilterLabel>Data Inicial</FilterLabel>
          <FilterInput type="date" value={tempStartDate} onChange={(e) => setTempStartDate(e.target.value)} />
        </FilterContainer>
        <FilterContainer>
          <FilterLabel>Data Final</FilterLabel>
          <FilterInput type="date" value={tempEndDate} onChange={(e) => setTempEndDate(e.target.value)} />
        </FilterContainer>
      </FilterGrid>

      <ButtonsContainer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <ResetButton
          onClick={resetFilters}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.9)" }}
          whileTap={{ scale: 0.95 }}
        >
          Limpar Filtros
        </ResetButton>
        <ApplyButton
          $primary
          onClick={handleApplyFilter}
          whileHover={{ scale: 1.05, backgroundColor: "#EF4444" }}
          whileTap={{ scale: 0.95 }}
        >
          Aplicar Filtro
        </ApplyButton>
      </ButtonsContainer>
    </ModalBase>
  )
}

export default ModalFiltro
