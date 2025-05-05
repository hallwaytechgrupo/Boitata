import type React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { getFocosByBioamId, getFocosCalorByEstadoId } from '../services/api';
import { FilterType, ModalType, PatternType } from '../types';
import { useFilter } from './FilterContext';
import { useMap } from '../hooks/useMap';

interface ModalContextType {
  activeModal: ModalType | null;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  handleConfirm: () => Promise<void>;
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
        case ModalType.ESTADO:
          await handleEstadoConfirm();
          break;
        case ModalType.BIOMA:
          await handleBiomaConfirm();
          break;
        case ModalType.FILTROS:
          // Aqui você pode adicionar lógica específica para o modal de filtros
          break;
        case ModalType.FOCOS:
          // Lógica específica para o modal de focos
          break;
        // Adicione outros casos conforme necessário
      }

      closeModal();
    } catch (error) {
      console.error('Erro ao processar confirmação:', error);
      showToast('Erro ao carregar dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [activeModal, estado, bioma, activeLayers]);

  // Lógica específica para cada modal
  const handleEstadoConfirm = async () => {
    const estadoId = estado?.id.toString();

    if (!estadoId) {
      showToast('Estado não encontrado');
      console.error('Estado não encontrado');
      return;
    }

    const resultado = await getFocosCalorByEstadoId(estadoId);
    
    updateLayerData(PatternType.HEAT_MAP, resultado);
    if (!activeLayers.includes(PatternType.HEAT_MAP)) {
      toggleLayerVisibility(PatternType.HEAT_MAP);
    }
    
    if (estado) {
      flyToState(estado.id);
    }

    setFilterType(FilterType.ESTADO);
    showToast(`Exibindo dados para ${estado?.nome}`);
  };

  const handleBiomaConfirm = async () => {
    const biomaId = bioma?.id.toString();

    if (!biomaId) {
      showToast('Bioma não encontrado');
      console.error('Bioma não encontrado');
      return;
    }

    const resultado = await getFocosByBioamId(biomaId);
    
    updateLayerData(PatternType.HEAT_MAP, resultado);
    if (!activeLayers.includes(PatternType.HEAT_MAP)) {
      toggleLayerVisibility(PatternType.HEAT_MAP);
    }
    
    setFilterType(FilterType.BIOMA);
    showToast(`Exibindo dados para o bioma ${bioma?.nome}`);
  };

  const handleFocosConfirm = async () => {
    // Implemente a lógica específica para o modal de focos
    console.log('Processando confirmação do modal de focos');
    // Exemplo: ativar camada de focos de calor
    if (!activeLayers.includes(PatternType.HEAT_MAP)) {
      toggleLayerVisibility(PatternType.HEAT_MAP);
    }
    
    showToast('Visualização de focos de calor atualizada');
  };

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        openModal,
        closeModal,
        handleConfirm,
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
