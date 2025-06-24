import { useState, useEffect } from 'react';
import { X, FilterIcon, Map as MapIcon, Calendar, Eye, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalBase from '../_base/ModalBase';
import { useFilter } from '../../../contexts/FilterContext';
import { FilterType, PatternType, type LocationType } from '../../../types';
import { estados } from '../../../utils/estados';
import { biomas } from '../../../utils/biomas';
import {
  TabsContainer,
  Tab,
  FilterContainer,
  FilterLabel,
  FilterSelect,
  FilterInput,
  FilterGrid,
  ActiveFiltersContainer,
  ActiveFiltersTitle,
  ActiveFiltersList,
  ActiveFilterTag,
  RemoveFilterButton,
  ButtonsContainer,
  ResetButton,
  ApplyButton,
  Section,
  SectionTitle,
} from './filtros-styled';
import cidadesPorEstado from '../../../utils/cidades';
import { useModal } from '../../../contexts/ModalContext';
import styled from 'styled-components';
import { useMap } from '../../../hooks/useMap';

// ED.04 Algoritmos de busca em vetores
const findEstadoById = (
  id: number,
  estados: LocationType[],
): LocationType | undefined => {
  let inicio = 0;                     
  let fim = estados.length - 1;

  while (inicio <= fim) {
    // MATEMÁTICA PARA COMPUTAÇÃO 4. Funções Matemáticas Algébricas e Suas Aplicações
    const meio = Math.floor((inicio + fim) / 2);
    
    if (estados[meio].id === id) {
      return estados[meio];
    }
    
    if (estados[meio].id < id) {
      inicio = meio + 1;
    } else {
      fim = meio - 1;
    }
  }

  return undefined;
};

// ED.03 Algoritmos de ordenação (vetores numéricos, cadeias, etc.)
const quickSortEstados = (arr: LocationType[]): LocationType[] => {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(
    (estado) => estado.nome.localeCompare(pivot.nome) < 0,
  );
  const middle = arr.filter(
    (estado) => estado.nome.localeCompare(pivot.nome) === 0,
  );
  const right = arr.filter(
    (estado) => estado.nome.localeCompare(pivot.nome) > 0,
  );

  return [...quickSortEstados(left), ...middle, ...quickSortEstados(right)];
};

interface FiltrosModalProps {
  onClose: () => void;
  onConfirm?: () => void;
}

const ModalFiltro: React.FC<FiltrosModalProps> = ({ onClose, onConfirm }) => {
  const {
    estado,
    cidade,
    bioma,
    filterType,
    patternType,
    dateRange,
    setEstado,
    setCidade,
    setBioma,
    setFilterType,
    setPatternType,
    setDateRange,
    resetFilters,
    hasActiveFilters,
  } = useFilter();

  // Acesso direto ao useMap para atualizar os dados
  const { handleFiltrosConfirm } = useModal();
  const {resetMapView} = useMap();

  // ED.03 Algoritmos de ordenação (vetores numéricos, cadeias, etc.)
  const estadosOrdenados = quickSortEstados([...estados]);

  // Update the initial state of activeTab based on current filterType
  const [activeTab, setActiveTab] = useState<'estado' | 'bioma'>(
    filterType === FilterType.BIOMA ? 'bioma' : 'estado'
  );

  const MIN_DATE = '2024-08-01';
  const MAX_DATE = new Date().toISOString().split('T')[0];

  const [tempStartDate, setTempStartDate] = useState(dateRange.startDate);
  const [tempEndDate, setTempEndDate] = useState(dateRange.endDate);
  const [isLoading, setIsLoading] = useState(false);

  const getMunicipios = (estadoId: number): LocationType[] => {
    return (
      cidadesPorEstado[estadoId.toString() as keyof typeof cidadesPorEstado] ||
      []
    );
  };

  const handleApplyFilter = async () => {
    try {
      setIsLoading(true);

      // Se for RISCO_FOGO, garantimos que usa a data fixa
      if (isRiscoFogo) {
        const fixedDate = '2025-06-16';
        setDateRange({
          startDate: fixedDate,
          endDate: fixedDate,
        });
      } else {
        setDateRange({
          startDate: tempStartDate,
          endDate: tempEndDate,
        });
      }

      let currentFilterType = FilterType.NONE;

      // MATEMÁTICA PARA COMPUTAÇÃO - LÓGICA PROPOSICIONLA
      if (activeTab === 'estado') {
        currentFilterType = cidade ? FilterType.MUNICIPIO : FilterType.ESTADO;
      } else if (activeTab === 'bioma' && bioma) {
        currentFilterType = FilterType.BIOMA;
      }

      await handleFiltrosConfirm(
        currentFilterType,
        estado,
        cidade,
        bioma,
        isRiscoFogo ? '2025-06-16' : tempStartDate,
        isRiscoFogo ? '2025-06-16' : tempEndDate,
        patternType
      );

      // Se houver um callback onConfirm, chame-o
      if (onConfirm) {
        onConfirm();
      }

      onClose();
    } catch (error) {
      console.error('Erro ao aplicar filtros:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePatternTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      setPatternType(selectedValue as PatternType);
      
      // Se o tipo selecionado for RISCO_FOGO, definimos uma data fixa e estado padrão
      if (selectedValue === PatternType.RISCO_FOGO) {
        const fixedDate = '2025-06-16';
        setTempStartDate(fixedDate);
        setTempEndDate(fixedDate);
        setFilterType(FilterType.ESTADO);
        setEstado(estadosOrdenados[0]);
        resetMapView(); // Resetar a visualização do mapa
      }
      
      // Se o tipo selecionado for QUEIMADA e há município selecionado, voltar para estado
      if (selectedValue === PatternType.QUEIMADA && cidade) {
        setCidade(null);
        setFilterType(FilterType.ESTADO);
      }
    } else {
      setPatternType(null);
    }
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number.parseInt(e.target.value);
    if (selectedId) {

      // ED.04 Algoritmos de busca em vetores
      const selectedEstado = estados.find((estado) => estado.id === selectedId);

      if (selectedEstado) {
        setEstado(selectedEstado);
        setFilterType(FilterType.ESTADO);
        setCidade(null);
      }
    } else {
      setFilterType(FilterType.NONE);
      setCidade(null);
    }
  };

  const handleCidadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number.parseInt(e.target.value);
    if (selectedId && estado) {
      const selectedCidade = getMunicipios(estado.id).find(
        (c) => c.id === selectedId,
      );
      if (selectedCidade) {
        setFilterType(FilterType.MUNICIPIO);
        setCidade(selectedCidade);
      }
    }
  };

  const handleBiomaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number.parseInt(e.target.value);
    if (selectedId) {
      const selectedBioma = biomas.find((b) => b.id === selectedId);
      if (selectedBioma) {
        setFilterType(FilterType.BIOMA);
        setBioma(selectedBioma);
      }
    } else {
      setFilterType(FilterType.NONE);
    }
  };

  // Verifique se estamos usando o tipo RISCO_FOGO para mostrar apenas uma data
  const isRiscoFogo = patternType === PatternType.RISCO_FOGO;

  // Variantes para animações
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  // Add a useEffect to update activeTab when filterType changes
  useEffect(() => {
    if (filterType === FilterType.BIOMA) {
      setActiveTab('bioma');
    } else if (filterType === FilterType.ESTADO || filterType === FilterType.MUNICIPIO) {
      setActiveTab('estado');
    }
  }, [filterType]);

  // Add console logging to debug tab changes
  console.log("Current activeTab:", activeTab);
  console.log("Current filterType:", filterType);
  console.log("Current patternType:", patternType);

  // Handle tab change function to ensure proper state update
  const handleTabChange = (tab: 'estado' | 'bioma') => {
    console.log("Tab clicked:", tab);
    setActiveTab(tab);
    
    // Reset filters related to the other tab
    if (tab === 'estado') {
      setBioma(null);
      if (!estado) {
        setFilterType(FilterType.NONE);
      }
    } else {
      setEstado(null);
      setCidade(null);
      if (!bioma) {
        setFilterType(FilterType.NONE);
      } else {
        setFilterType(FilterType.BIOMA);
      }
    }
  };

  // Let's try a different approach to styling tabs
  return (
    <ModalBase title="Filtros" onClose={onClose} compact={true} customWidth='60vw' customHeight='99vh'>
      <AnimatePresence>
        {hasActiveFilters && (
          <ActiveFiltersContainer
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveFiltersTitle>
              <FilterIcon size={14} color="#FF7300" />
              Filtros Ativos
            </ActiveFiltersTitle>
            <ActiveFiltersList>
              {/* Estado é sempre mostrado quando selecionado */}
              {estado && (
                <ActiveFilterTag
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Estado: {estado.nome}
                  <RemoveFilterButton
                    onClick={() => {
                      setEstado(null);
                      setCidade(null);
                      setFilterType(FilterType.NONE);
                    }}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={12} />
                  </RemoveFilterButton>
                </ActiveFilterTag>
              )}

              {/* Município só é mostrado quando selecionado */}
              {cidade && (
                <ActiveFilterTag
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Município: {cidade.nome}
                  <RemoveFilterButton
                    onClick={() => {
                      setCidade(null);
                      setFilterType(FilterType.ESTADO); // Volta para filtro por estado
                    }}
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
                    onClick={() => setDateRange({ startDate: '', endDate: '' })}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={12} />
                  </RemoveFilterButton>
                </ActiveFilterTag>
              )}
              {patternType && (
                <ActiveFilterTag
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Visualização: {
                  patternType === PatternType.HEAT_MAP 
                    ? 'Mapa de Calor' 
                    : patternType === PatternType.QUEIMADA 
                    ? 'Área Queimada' 
                    : patternType === PatternType.RISCO_FOGO 
                      ? 'Risco de Fogo'
                      : 'Desconhecido'
                  }
                  <RemoveFilterButton
                  onClick={() => setPatternType(null)}
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Section variants={itemVariants}>
          <SectionTitle>
            <Layers size={14} color="#FF7300" />
            Visualização
          </SectionTitle>
          
          <RadioGroup>
            <RadioOption $isSelected={patternType === PatternType.HEAT_MAP}>
              <RadioInput
                type="radio"
                id="heat-map"
                name="patternType"
                value={PatternType.HEAT_MAP}
                checked={patternType === PatternType.HEAT_MAP}
                onChange={handlePatternTypeChange}
              />
              <RadioLabel>Mapa de Calor</RadioLabel>
            </RadioOption>
            
            <RadioOption $isSelected={patternType === PatternType.QUEIMADA}>
              <RadioInput
                type="radio"
                id="queimada"
                name="patternType"
                value={PatternType.QUEIMADA}
                checked={patternType === PatternType.QUEIMADA}
                onChange={handlePatternTypeChange}
              />
              <RadioLabel>Área Queimada</RadioLabel>
            </RadioOption>
            
            <RadioOption $isSelected={patternType === PatternType.RISCO_FOGO}>
              <RadioInput
                type="radio"
                id="risco-fogo"
                name="patternType"
                value={PatternType.RISCO_FOGO}
                checked={patternType === PatternType.RISCO_FOGO}
                onChange={handlePatternTypeChange}
              />
              <RadioLabel>Risco de Fogo</RadioLabel>
            </RadioOption>
          </RadioGroup>
        </Section>

        {patternType !== PatternType.RISCO_FOGO && (
          <Section variants={itemVariants}>
            <SectionTitle>
              <MapIcon size={14} color="#FF7300" />
              Localização
            </SectionTitle>
            
            <TabsContainer>
              <Tab
                onClick={() => handleTabChange('estado')}
                $isActive={activeTab === 'estado'}
                whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  backgroundColor: activeTab === 'estado' ? 'rgba(255, 115, 0, 0.9)' : 'transparent',
                  color: activeTab === 'estado' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
                }}
              >
                Estado
              </Tab>
              <Tab
                onClick={() => handleTabChange('bioma')}
                $isActive={activeTab === 'bioma'}
                whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  backgroundColor: activeTab === 'bioma' ? 'rgba(255, 115, 0, 0.9)' : 'transparent',
                  color: activeTab === 'bioma' ? '#fff' : 'rgba(255, 255, 255, 0.7)'
                }}
              >
                Bioma
              </Tab>
            </TabsContainer>

            <AnimatePresence mode="wait">
              {activeTab === 'estado' && (
                <motion.div
                  key="estado-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <FilterContainer>
                    <FilterLabel>Estado</FilterLabel>
                    <FilterSelect
                      value={estado?.id || ''}
                      onChange={handleEstadoChange}
                      disabled={!patternType}
                    >
                      <option value="">Selecione um estado</option>
                      {estadosOrdenados.map(
                        (
                          e, // Use estadosOrdenados em vez de estados
                        ) => (
                          <option key={e.id} value={e.id}>
                            {e.nome}
                          </option>
                        ),
                      )}
                    </FilterSelect>
                  </FilterContainer>

                  {estado && patternType !== PatternType.QUEIMADA && (
                    <FilterContainer>
                      <FilterLabel>Município</FilterLabel>
                      <FilterSelect
                        value={cidade?.id || ''}
                        onChange={handleCidadeChange}
                        disabled={!patternType || !estado}
                      >
                        <option value="">Selecione um município</option>
                        {getMunicipios(estado.id).map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nome}
                          </option>
                        ))}
                      </FilterSelect>
                    </FilterContainer>
                  )}
                </motion.div>
              )}

              {activeTab === 'bioma' && (
                <motion.div
                  key="bioma-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <FilterContainer>
                    <FilterLabel>Bioma</FilterLabel>
                    <FilterSelect
                      value={bioma?.id || ''}
                      onChange={handleBiomaChange}
                      disabled={!patternType}
                    >
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
          </Section>
        )}

        <Section variants={itemVariants}>
          <SectionTitle>
            <Calendar size={14} color="#FF7300" />
            Período
          </SectionTitle>
          
          <FilterGrid>
            <FilterContainer>
              <FilterLabel>{isRiscoFogo ? "Data do Risco" : "Data Inicial"}</FilterLabel>
              <FilterInput
                type="date"
                value={isRiscoFogo ? '2025-06-16' : tempStartDate}
                onChange={(e) => {
                  if (!isRiscoFogo) {
                    const newStartDate = e.target.value;
                    setTempStartDate(newStartDate);

                    if (tempEndDate && newStartDate > tempEndDate) {
                      setTempEndDate(newStartDate);
                    }
                  }
                }}
                min={MIN_DATE}
                max={MAX_DATE}
                disabled={isRiscoFogo || !patternType || (!estado && !bioma)}
              />
            </FilterContainer>
            
            {/* Mostrar a data final apenas se NÃO for RISCO_FOGO */}
            {!isRiscoFogo && (
              <FilterContainer>
                <FilterLabel>Data Final</FilterLabel>
                <FilterInput
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  min={tempStartDate || MIN_DATE}
                  max={MAX_DATE}
                  disabled={!patternType || (!estado && !bioma) || !tempStartDate}
                />
              </FilterContainer>
            )}
          </FilterGrid>
        </Section>
      </motion.div>
      
      <ButtonsContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ResetButton
          onClick={resetFilters}
          disabled={isLoading}
        >
          Limpar Filtros
        </ResetButton>
        <ApplyButton
          onClick={handleApplyFilter}
          disabled={isLoading || !patternType || (!estado && !bioma) || !tempStartDate || (!isRiscoFogo && !tempEndDate)}
        >
          {isLoading ? 'Carregando...' : 'Aplicar Filtro'}
        </ApplyButton>
      </ButtonsContainer>
    </ModalBase>
  );
};

export default ModalFiltro;

// Add new styled components for radio buttons
const RadioGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex-wrap: nowrap;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const RadioOption = styled.label<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid ${props => props.$isSelected ? '#FF7300' : 'transparent'};
  background-color: ${props => props.$isSelected ? 'rgba(255, 115, 0, 0.1)' : 'transparent'};
  transition: all 0.2s ease;
  flex: 1;
  min-width: 0;
  
  &:hover {
    background-color: ${props => props.$isSelected ? 'rgba(255, 115, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${props => props.$isSelected ? '#FF7300' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #FF7300;
  cursor: pointer;
`;

const RadioLabel = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;