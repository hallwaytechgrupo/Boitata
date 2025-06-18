import type React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { getAreaQueimadaByBiomaId, getAreaQueimadaByEstadoId, getFocosByBiomaId, getFocosCalorByEstadoId, getFocosCalorByMunicipioId } from '../services/api';
import { FilterType, PatternType, type LocationType, ModalType } from '../types';
import { useFilter } from './FilterContext';
import { useMap } from '../hooks/useMap'
import geoData from '../../public/bioma.json';

// Define a type for the GeoJSON FeatureCollection if not already available
interface GeoJsonFeatureCollection {
  type: string;
  features: any[];
}

// Cast geoData to the correct type
const typedGeoData = geoData as GeoJsonFeatureCollection;

interface ModalContextType {
  activeModal: ModalType | null;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  handleConfirm: () => Promise<void>;
  handleFiltrosConfirm: (
    filterType: FilterType,
    estado: LocationType | null,
    cidade: LocationType | null, 
    bioma: LocationType | null,
    dataInicio: string,
    dataFim: string,
    patternType: PatternType | null
  ) => Promise<void>;
  isLoading: boolean;
}

interface ModalProviderProps {
  children: React.ReactNode;
  updateLayerData: (patternType: PatternType, data: any) => void;
  toggleLayerVisibility: (patternType: PatternType) => void;
  activeLayers: PatternType[];
  flyToState: (estadoId: number) => void;
  flyToBioma?: (biomaId: number) => void;
  showToast: (message: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({
  children,
  updateLayerData,
  toggleLayerVisibility,
  activeLayers,
  flyToState,
  flyToBioma,
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
    estado: LocationType | null,
    cidade: LocationType | null, 
    bioma: LocationType | null,
    dataInicio: string,
    dataFim: string,
    patternType: PatternType | null
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
        
        // Verificar o tipo de padrão selecionado
        if (!patternType || patternType === PatternType.HEAT_MAP) {
          const resultado = await getFocosCalorByMunicipioId(
            municipioId,
            dataInicio,
            dataFim
          );
          
          updateLayerData(PatternType.HEAT_MAP, resultado);
          if (!activeLayers.includes(PatternType.HEAT_MAP)) {
            toggleLayerVisibility(PatternType.HEAT_MAP);
          }
        } else if (patternType === PatternType.RISCO_FOGO) {
          console.log("Carregando dados de Risco de Fogo para o município:", cidade.nome);
          // Implementação futura para dados de risco de fogo
        } else if (patternType === PatternType.QUEIMADA) {
          console.log("Carregando dados de Área Queimada para o município:", cidade.nome);
          // Implementação futura para dados de área queimada
        }

        flyToState(estado.id);
        
        setFilterType(FilterType.MUNICIPIO);
      }
      // Caso: Filtro por estado
      else if (filterType === FilterType.ESTADO && estado) {
        const estadoId = estado.id.toString();
        
        console.log(`Buscando dados para o estado: ${estado.nome} (ID: ${estadoId})`);
        console.log('Datas de filtro:', dataInicio, dataFim);
        
        // Verificar o tipo de padrão selecionado
        if (!patternType || patternType === PatternType.HEAT_MAP) {
          const resultado = await getFocosCalorByEstadoId(
            estadoId,
            dataInicio,
            dataFim
          );
          
          updateLayerData(PatternType.HEAT_MAP, resultado);
          if (!activeLayers.includes(PatternType.HEAT_MAP)) {
            toggleLayerVisibility(PatternType.HEAT_MAP);
          }
        } else if (patternType === PatternType.RISCO_FOGO) {
          console.log("Carregando dados de Risco de Fogo para o estado:", estado.nome);
          // Implementação futura para dados de risco de fogo
        } else if (patternType === PatternType.QUEIMADA) {
          console.log("Carregando dados de Área Queimada para o estado:", estado.nome);
          
          const resultado = await getAreaQueimadaByEstadoId(
            estadoId,
            dataInicio,
            dataFim
          );

          console.log('Resultado da área queimada por estado:', resultado);
          console.log("Tamanho do features:", resultado.features.length);

          if (!resultado.features || resultado.features.length === 0) {
            console.log('Nenhum dado encontrado para o estado selecionado.');
            showToast('Nenhum dado encontrado para o estado selecionado.');
          }
          
          updateLayerData(PatternType.QUEIMADA, resultado);
          if (!activeLayers.includes(PatternType.QUEIMADA)) {
            toggleLayerVisibility(PatternType.QUEIMADA);
          }
        }
        
        if (estado) {
          flyToState(estado.id);
        }

        // Carregar contorno do estado
        try {
          // Busca a geometria do estado via IBGE GeoJSON API
          const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v2/malhas/${estadoId}?formato=application/vnd.geo+json`
          );
          if (!response.ok) {
            throw new Error(`Erro ao buscar geometria do estado: ${response.statusText}`);
          }
          const geojson = await response.json();

          // O endpoint retorna um objeto Geometry, não Feature ou FeatureCollection
          // Precisamos embrulhar em um Feature e FeatureCollection manualmente
          let estadoFeature;
          if (geojson.type === "FeatureCollection") {
            estadoFeature = geojson.features[0];
          } else if (geojson.type === "Feature") {
            estadoFeature = geojson;
          } else if (geojson.type === "MultiPolygon" || geojson.type === "Polygon") {
            estadoFeature = {
              type: "Feature",
              geometry: geojson,
              properties: { id: estadoId, nome: estado.nome }
            };
          }

          if (estadoFeature && estadoFeature.geometry) {
            const estadoData = {
              type: "FeatureCollection",
              features: [estadoFeature],
            };

            console.log('Contorno do estado encontrado:', estadoData);

            // Aguardar um momento para garantir que o pattern está inicializado
            setTimeout(() => {
              updateLayerData(PatternType.ESTADO, estadoData);
              if (!activeLayers.includes(PatternType.ESTADO)) {
                toggleLayerVisibility(PatternType.ESTADO);
              }
            }, 100);
            
            console.log('Contorno do estado carregado:', estadoData);
          } else {
            console.warn(`⚠ Nenhum dado de geometria encontrado para o estado ${estado.nome}.`);
          }
        } catch (error) {
          console.error('Erro ao carregar o contorno do estado:', error);
          showToast('Erro ao carregar o contorno do estado.');
        }
        
        setFilterType(FilterType.ESTADO);
      }
      // Caso: Filtro por bioma
      else if (filterType === FilterType.BIOMA && bioma) {
        console.log('Datas de filtro:', dataInicio, dataFim);
        
        // Carrega o contorno do bioma a partir do arquivo local biomas.json
        try {
          
          // Filtra o geojson para obter apenas o bioma selecionado

          console.log("O typedGeoData é:", typedGeoData);

            const biomaFeature = typedGeoData.features.find((feature: any) =>
            feature.properties.id_bioma?.toString() === bioma.id.toString()
            );

          console.log('Bioma selecionado:', bioma.nome);
          console.log('Contorno do bioma encontrado:', biomaFeature);
          
          if (biomaFeature) {
            const biomaData = {
              type: "FeatureCollection",
              features: [biomaFeature]
            };

            console.log('Contorno do bioma encontrado:', biomaData);
            
            // Adiciona a camada de contorno do bioma
            updateLayerData(PatternType.BIOMA, biomaData);
            if (!activeLayers.includes(PatternType.BIOMA)) {
              toggleLayerVisibility(PatternType.BIOMA);
            }
            
            console.log('Contorno do bioma carregado para:', bioma.nome);
          } else {
            console.warn('Contorno do bioma não encontrado para o ID:', bioma.id);
          }
        } catch (error) {
          console.error('Erro ao carregar o contorno do bioma:', error);
        }
        
        // Verificar o tipo de padrão selecionado
        if (!patternType || patternType === PatternType.QUEIMADA) {
          const resultado = await getAreaQueimadaByBiomaId(
            bioma.id.toString(),
            dataInicio,
            dataFim
          );

          console.log('Resultado da área queimada por bioma:', resultado);
          console.log("Tamanho do features:", resultado.features.length);

          if (!resultado.features || resultado.features.length === 0) {
            console.log('Nenhum dado encontrado para o bioma selecionado.');
            showToast('Nenhum dado encontrado para o bioma selecionado.');
          }
          
          updateLayerData(PatternType.QUEIMADA, resultado);
          if (!activeLayers.includes(PatternType.QUEIMADA)) {
            toggleLayerVisibility(PatternType.QUEIMADA);
          }
        } else if (patternType === PatternType.HEAT_MAP) {
          console.log("Carregando dados de Risco de Fogo para o bioma:", bioma.nome);
          // Implementação futura para dados de risco de fogo

          const resultado = await getFocosByBiomaId(
            bioma.id.toString(),
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

        } else if (patternType === PatternType.RISCO_FOGO) {
          console.log("Carregando dados de Área Queimada para o bioma:", bioma.nome);
          // Implementação futura para dados de área queimada
        }
        
        if (flyToBioma) {
          flyToBioma(bioma.id);
        }
        
        // resetMapView(); // Reset view to show all biomas
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
