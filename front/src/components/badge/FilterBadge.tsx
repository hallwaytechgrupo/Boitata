import styled from "styled-components"
import { Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FilterType } from "../../types"
import { useFilter } from "../../contexts/FilterContext"

const BadgeContainer = styled(motion.div)`
  position: fixed;
  top: 120px;
  left: 16px;
  z-index: 20;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column; // Alterado para column para permitir quebra de linha
  max-width: 300px;
  width: 100%;
  border: 1px solid rgba(255, 115, 0, 0.3);
  
  @media (max-width: 640px) {
    max-width: 200px;
    padding: 4px 8px;
  }
`

const BadgeHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.hasDateFilter ? '4px' : '0'};
  width: 100%;
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

const DateText = styled(motion.span)`
  font-size: 0.8rem;
  color: #E5E7EB;
  margin-left: 24px; // Alinhado com o texto acima (depois do ícone)
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 640px) {
    font-size: 0.7rem;
  }
`

const FilterBadge = () => {
  const { estado, cidade, bioma, filterType, dateRange, hasActiveFilters } = useFilter()

  // Construir texto do filtro
  let filterText = ""
  const hasDateFilter = !!(dateRange.startDate && dateRange.endDate);

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
          <BadgeHeader hasDateFilter={hasDateFilter}>
            <BadgeIcon animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Filter size={16} color="#FF7300" />
            </BadgeIcon>
            <BadgeText initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {filterText || "Filtro Ativo"}
            </BadgeText>
          </BadgeHeader>
          
          {hasDateFilter && (
            <DateText 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.4 }}
            >
              Período: {dateRange.startDate} a {dateRange.endDate}
            </DateText>
          )}
        </BadgeContainer>
      )}
    </AnimatePresence>
  )
}

export default FilterBadge