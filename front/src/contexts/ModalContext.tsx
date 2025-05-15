import type React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { getFocosByBiomaId, getFocosCalorByEstadoId, getFocosCalorByMunicipioId } from '../services/api';
import { FilterType, type LocationType, ModalType, PatternType } from '../types';
import { useFilter } from './FilterContext';
import { useMap } from '../hooks/useMap';

interface ModalContextType {
  activeModal: ModalType | null;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  handleConfirm: () => Promise<void>;
  handleFiltrosConfirm: (
    filterType: FilterType,
    estado?: LocationType | null,
    cidade?: LocationType | null, 
    bioma?: LocationType | null,
    dataInicio?: string,
    dataFim?: string
  ) => Promise<void>;
  isLoading: boolean;
}

interface ModalProviderProps {
  children: React.ReactNode;
  updateLayerData: (patternType: PatternType, data: any) => void;
  toggleLayerVisibility: (patternType: PatternType) => void;
  activeLayers: PatternType[];
  flyToState: (estadoId: number) => void;
  showToast: (message: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({
  children,
  updateLayerData,
  toggleLayerVisibility,
  activeLayers,
  flyToState,
  showToast,
}: ModalProviderProps) {
  const {resetMapView} = useMap();
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { estado, bioma, setFilterType } = useFilter();

  const openModal = useCallback((modal: ModalType) => {
    console.log('Abrindo modal:', modal);
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Centralização da lógica de confirmação dos modais
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const handleConfirm = useCallback(async () => {
    try {
      setIsLoading(true);

      // Lógica específica para cada tipo de modal
      switch (activeModal) {
        case ModalType.ANALISES:
          console.log('Processando confirmação do modal de análises');
          break;
      }

      closeModal();
    } catch (error) {
      console.error('Erro ao processar confirmação:', error);
      showToast('Erro ao carregar dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [activeModal, estado, bioma, activeLayers]);


  const handleFiltrosConfirm = async (
    filterType: FilterType,
    estado?: LocationType | null,
    cidade?: LocationType | null, 
    bioma?: LocationType | null,
    dataInicio?: string,
    dataFim?: string
  ) => {
    try {
      setIsLoading(true);
      
      // Caso: Filtro por município
      if (filterType === FilterType.MUNICIPIO && estado && cidade) {
        const estadoId = estado.id.toString();
        const municipioId = cidade.id.toString();
        
        console.log(
          `Buscando dados para o município: ${cidade.nome} (ID: ${municipioId}) no estado ${estado.nome} (ID: ${estadoId})`
        );
        console.log('Datas de filtro:', dataInicio, dataFim);
        
        const resultado = await getFocosCalorByMunicipioId(
          municipioId,
          dataInicio,
          dataFim
        );
        
        updateLayerData(PatternType.HEAT_MAP, resultado);
        if (!activeLayers.includes(PatternType.HEAT_MAP)) {
          toggleLayerVisibility(PatternType.HEAT_MAP);
        }

        flyToState(estado.id);
        
        setFilterType(FilterType.MUNICIPIO);
      }
      // Caso: Filtro por estado
      else if (filterType === FilterType.ESTADO && estado) {
        const estadoId = estado.id.toString();
        
        console.log(`Buscando dados para o estado: ${estado.nome} (ID: ${estadoId})`);
        console.log('Datas de filtro:', dataInicio, dataFim);
        
        const resultado = await getFocosCalorByEstadoId(
          estadoId,
          dataInicio,
          dataFim
        );
        
        updateLayerData(PatternType.HEAT_MAP, resultado);
        if (!activeLayers.includes(PatternType.HEAT_MAP)) {
          toggleLayerVisibility(PatternType.HEAT_MAP);
        }
        
        if (estado) {
          flyToState(estado.id);
        }
        
        setFilterType(FilterType.ESTADO);
      }
      // Caso: Filtro por bioma
      else if (filterType === FilterType.BIOMA && bioma) {
        const biomaId = bioma.id.toString();
        
        console.log(`Buscando dados para o bioma: ${bioma.nome} (ID: ${biomaId})`);
        console.log('Datas de filtro:', dataInicio, dataFim);
        
        const resultado = await getFocosByBiomaId(
          biomaId,
          dataInicio,
          dataFim
        );

        console.log('Resultado do filtro por bioma:', resultado);
        console.log("Tamanho do features:", resultado.features.length);

        if (!resultado.features || resultado.features.length === 0) {
          console.log('Nenhum dado encontrado para o bioma selecionado.');
          showToast('Nenhum dado encontrado para o bioma selecionado.');
        }
        
        updateLayerData(PatternType.HEAT_MAP, resultado);
        if (!activeLayers.includes(PatternType.HEAT_MAP)) {
          toggleLayerVisibility(PatternType.HEAT_MAP);
        }
        
        setFilterType(FilterType.BIOMA);
      }
    } catch (error) {
      console.error('Erro ao processar filtros:', error);
      showToast('Erro ao aplicar filtros. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        openModal,
        closeModal,
        handleConfirm,
        handleFiltrosConfirm,
        isLoading,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
