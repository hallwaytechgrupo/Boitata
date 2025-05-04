"use client"

import styled from "styled-components"
import { Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FilterType } from "../../types"
import { useFilter } from "../../contexts/FilterContext"

const BadgeContainer = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 16px;
  z-index: 20;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  max-width: 300px;
  width: 100%;
  
  @media (max-width: 640px) {
    max-width: 200px;
    padding: 4px 8px;
  }
`

const BadgeIcon = styled(motion.div)`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const BadgeText = styled(motion.span)`
  font-size: 0.875rem;
  font-weight: bold;
  color: #FF7300;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 640px) {
    font-size: 0.75rem;
  }
`

const FilterBadge = () => {
  const { estado, cidade, bioma, filterType, dateRange, hasActiveFilters } = useFilter()

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
      ? `, ${dateRange.startDate} a ${dateRange.endDate}`
      : `${dateRange.startDate} a ${dateRange.endDate}`
  }

  return (
    <AnimatePresence>
      {hasActiveFilters && (
        <BadgeContainer
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BadgeIcon animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Filter size={16} color="#FF7300" />
          </BadgeIcon>
          <BadgeText initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Filtros: {filterText}
          </BadgeText>
        </BadgeContainer>
      )}
    </AnimatePresence>
  )
}

export default FilterBadge
