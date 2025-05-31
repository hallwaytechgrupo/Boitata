import { useState } from 'react';
import { X, FilterIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModalBase from '../_base/ModalBase';
import { useFilter } from '../../../contexts/FilterContext';
import { FilterType, type LocationType } from '../../../types';
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
} from './filtros-styled';
import cidadesPorEstado from '../../../utils/cidades';
import { useModal } from '../../../contexts/ModalContext';

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
    dateRange,
    setEstado,
    setCidade,
    setBioma,
    setFilterType,
    setDateRange,
    resetFilters,
    hasActiveFilters,
  } = useFilter();

  // Acesso direto ao useMap para atualizar os dados
  const { handleFiltrosConfirm } = useModal();

  // ED.03 Algoritmos de ordenação (vetores numéricos, cadeias, etc.)
  const estadosOrdenados = quickSortEstados([...estados]);

  const [activeTab, setActiveTab] = useState<'estado' | 'bioma'>(
    filterType === FilterType.BIOMA ? 'bioma' : 'estado',
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

      setDateRange({
        startDate: tempStartDate,
        endDate: tempEndDate,
      });

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
        tempStartDate,
        tempEndDate,
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

  return (
    <ModalBase title="Filtros" onClose={onClose}>
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
            </ActiveFiltersList>
          </ActiveFiltersContainer>
        )}
      </AnimatePresence>

      <TabsContainer>
        <Tab
          onClick={() => setActiveTab('estado')}
          $isActive={activeTab === 'estado'}
          whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          Estado
        </Tab>
        <Tab
          onClick={() => setActiveTab('bioma')}
          $isActive={activeTab === 'bioma'}
          whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.3)' }}
          whileTap={{ scale: 0.95 }}
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

            {estado && (
              <FilterContainer>
                <FilterLabel>Município</FilterLabel>
                <FilterSelect
                  value={cidade?.id || ''}
                  onChange={handleCidadeChange}
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

      <FilterGrid
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FilterContainer>
          <FilterLabel>Data Inicial</FilterLabel>
          <FilterInput
            type="date"
            value={tempStartDate}
            onChange={(e) => {
              const newStartDate = e.target.value;
              setTempStartDate(newStartDate);

              if (tempEndDate && newStartDate > tempEndDate) {
                setTempEndDate(newStartDate);
              }
            }}
            min={MIN_DATE}
            max={MAX_DATE}
            disabled={!estado && !bioma && !cidade}
          />
        </FilterContainer>
        <FilterContainer>
          <FilterLabel>Data Final</FilterLabel>
          <FilterInput
            type="date"
            value={tempEndDate}
            onChange={(e) => setTempEndDate(e.target.value)}
            min={tempStartDate || MIN_DATE} // A data mínima é a data inicial selecionada
            max={MAX_DATE}
            disabled={(!estado && !bioma && !cidade) || !tempStartDate} // Desabilita se não tiver data inicial
          />
        </FilterContainer>
      </FilterGrid>
      <ButtonsContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ResetButton
          onClick={resetFilters}
          // whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.9)" }}
          // whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          Limpar Filtros
        </ResetButton>
        <ApplyButton
          onClick={handleApplyFilter}
          // whileHover={{ scale: 1.05, backgroundColor: "#EF4444" }}
          // whileTap={{ scale: 0.95 }}
          disabled={isLoading || (!estado && !bioma && !cidade)}
        >
          {isLoading ? 'Carregando...' : 'Aplicar Filtro'}
        </ApplyButton>
      </ButtonsContainer>
    </ModalBase>
  );
};

export default ModalFiltro;
