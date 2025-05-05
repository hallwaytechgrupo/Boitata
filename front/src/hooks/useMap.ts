import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { statesCoordinates } from '../utils/coordenadasEstados';
import { HeatMapPattern } from '../patterns/FocosCalorPattern';
import { BiomaPattern } from '../patterns/BiomaPattern';
import { QueimadaPattern } from '../patterns/QueimadaPattern';
import { RiscoFogoPattern } from '../patterns/RiscoFogoPattern';
import { patterns, PatternType } from '../types';

// Armazena o mapa globalmente para garantir que esteja sempre acessível
let globalMapInstance: mapboxgl.Map | null = null;

// Criar instâncias das classes Pattern
const heatMapPattern = new HeatMapPattern();
const biomaPattern = new BiomaPattern();
const queimadaPattern = new QueimadaPattern();
const riscoFogoPattern = new RiscoFogoPattern();

export const useMap = (initialOptions = {}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeLayers, setActiveLayers] = useState<PatternType[]>([
    PatternType.HEAT_MAP,
  ]);

  // Rastrear quais padrões já foram inicializados
  const [initializedPatterns, setInitializedPatterns] = useState<PatternType[]>(
    [],
  );
  const [allPatternsInitialized, setAllPatternsInitialized] = useState(false);

  // Initialize the map and all layers once
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Se já temos uma instância global do mapa, não inicialize novamente
    if (globalMapInstance) {
      console.log('Usando instância existente do mapa');
      setIsMapLoaded(globalMapInstance.loaded());
      return;
    }

    console.log('Initializing map...');
    mapboxgl.accessToken =
      'pk.eyJ1IjoiYm9pdGF0YSIsImEiOiJjbTlrZGF3ejgwb2FxMnJvYWZ1Z3pudndpIn0.EiV7WmRDDZZBkY2A0PSJ1A';

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-55.491477, -13.720512],
        zoom: 4,
        attributionControl: false,
        logoPosition: 'top-right',
        ...initialOptions,
      });

      // Armazena a instância do mapa globalmente
      globalMapInstance = map;

      map.on('load', () => {
        console.log('Map loaded successfully');

        // Initialize all patterns
        initializePatterns(map);

        // É importante garantir que isso é definido como true
        setIsMapLoaded(true);

        // Make the map instance available globally (useful for debugging)
        (window as any).mapboxMap = map;
      });

      map.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Erro ao carregar o mapa. Por favor, recarregue a página.');
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(
        'Não foi possível inicializar o mapa. Por favor, verifique sua conexão.',
      );
    }

    return () => {
      // Não remover o mapa no cleanup para manter a referência global
    };
  }, []);

  // Initialize all patterns directly
  const initializePatterns = async (map: mapboxgl.Map) => {
    try {
      // Inicializar HeatMap pattern
      await heatMapPattern.initialize(map);
      heatMapPattern.setVisibility(
        map,
        activeLayers.includes(PatternType.HEAT_MAP),
      );

      // Inicializar Bioma pattern
      // await biomaPattern.initialize(map);
      // biomaPattern.setVisibility(map, activeLayers.includes(PatternType.BIOMA));

      // Inicializar Queimada pattern
      await queimadaPattern.initialize(map);
      queimadaPattern.setVisibility(
        map,
        activeLayers.includes(PatternType.QUEIMADA),
      );

      // Inicializar RiscoFogo pattern
      await riscoFogoPattern.initialize(map);
      riscoFogoPattern.setVisibility(
        map,
        activeLayers.includes(PatternType.RISCO_FOGO),
      );

      // Marcar todos os padrões como inicializados
      setInitializedPatterns([
        PatternType.HEAT_MAP,
        PatternType.BIOMA,
        PatternType.QUEIMADA,
        PatternType.RISCO_FOGO,
      ]);

      setAllPatternsInitialized(true);

      console.log('All patterns initialized successfully');
    } catch (error) {
      console.error('Error initializing patterns:', error);
      setMapError('Erro ao inicializar camadas do mapa.');
    }
  };

  // Toggle layer visibility using pattern classes
  const toggleLayerVisibility = useCallback(
    (patternType: PatternType) => {
      if (!globalMapInstance || !isMapLoaded) {
        console.log('Mapa não está pronto para alternar visibilidade');
        return;
      }

      try {
        const isCurrentlyActive = activeLayers.includes(patternType);
        const action = !isCurrentlyActive ? 'ativada' : 'desativada';

        // Usar o pattern apropriado para alternar visibilidade
        switch (patternType) {
          case PatternType.HEAT_MAP:
            heatMapPattern.setVisibility(globalMapInstance, !isCurrentlyActive);
            break;
          case PatternType.BIOMA:
            biomaPattern.setVisibility(globalMapInstance, !isCurrentlyActive);
            break;
          case PatternType.QUEIMADA:
            queimadaPattern.setVisibility(
              globalMapInstance,
              !isCurrentlyActive,
            );
            break;
          case PatternType.RISCO_FOGO:
            riscoFogoPattern.setVisibility(
              globalMapInstance,
              !isCurrentlyActive,
            );
            break;
        }

        console.log(`Layer ${patterns[patternType].name} ${action}`);

        // Atualizar o estado para refletir a mudança
        setActiveLayers((prev) => {
          if (isCurrentlyActive) {
            return prev.filter((p) => p !== patternType);
          }
          return [...prev, patternType];
        });
      } catch (error) {
        console.error(
          `Error toggling layer visibility for ${patternType}:`,
          error,
        );
      }
    },
    [isMapLoaded, activeLayers],
  );

  // Update layer data using pattern classes
  const updateLayerData = useCallback((patternType: PatternType, data: any) => {
    console.log('Tentando atualizar dados para:', patternType);

    // Garantir que temos uma instância do mapa
    if (!globalMapInstance) {
      console.error('Instância global do mapa não disponível');

      // Tentar recuperar do objeto window
      if ((window as any).mapboxMap) {
        console.log('Recuperando mapa da variável global window.mapboxMap');
        globalMapInstance = (window as any).mapboxMap;
      } else {
        console.error('Não foi possível encontrar uma instância do mapa');
        return;
      }
    }

    const map = globalMapInstance;

    // Verificar se o mapa está realmente carregado
    if (!map?.loaded()) {
      console.log('Mapa ainda não carregado. Aguardando...');

      const checkInterval = setInterval(() => {
        if (map?.loaded()) {
          clearInterval(checkInterval);
          console.log(
            'Mapa agora está carregado. Prosseguindo com atualização de dados...',
          );
          updatePatternData(map, patternType, data);
        }
      }, 100);

      // Timeout de segurança
      setTimeout(() => clearInterval(checkInterval), 10000);
      return;
    }

    updatePatternData(map, patternType, data);
  }, []);

  // Função auxiliar para atualizar dados usando a classe pattern
  const updatePatternData = (
    map: mapboxgl.Map,
    patternType: PatternType,
    data: any,
  ) => {
    try {
      const validData = ensureValidGeoJSON(data);

      // Usar o pattern apropriado para atualizar dados
      switch (patternType) {
        case PatternType.HEAT_MAP:
          heatMapPattern.update(map, validData);
          heatMapPattern.setVisibility(map, true);
          break;
        case PatternType.BIOMA:
          biomaPattern.update(map, validData);
          biomaPattern.setVisibility(map, true);
          break;
        case PatternType.QUEIMADA:
          queimadaPattern.update(map, validData);
          queimadaPattern.setVisibility(map, true);
          break;
        case PatternType.RISCO_FOGO:
          riscoFogoPattern.update(map, validData);
          riscoFogoPattern.setVisibility(map, true);
          break;
      }

      // Atualizar o estado para refletir que a camada está ativa
      setActiveLayers((prev) => {
        if (!prev.includes(patternType)) {
          return [...prev, patternType];
        }
        return prev;
      });

      console.log(`✅ Dados atualizados com sucesso para ${patternType}`);
    } catch (error) {
      console.error(`Erro ao atualizar dados para ${patternType}:`, error);
    }
  };

  // Função para garantir que os dados estão em formato GeoJSON válido
  const ensureValidGeoJSON = (data: any) => {
    try {
      if (data && data.type === 'FeatureCollection') {
        if (data.features === null) {
          return { ...data, features: [] };
        }
        return data;
      }

      return {
        type: 'FeatureCollection',
        features: Array.isArray(data) ? data : [],
      };
    } catch (e) {
      console.error('Erro ao processar GeoJSON:', e);
      return {
        type: 'FeatureCollection',
        features: [],
      };
    }
  };

  // Fly to state
  const flyToState = useCallback((estadoId: number) => {
    if (!globalMapInstance || !statesCoordinates[estadoId]) return;

    try {
      const { latitude, longitude } = statesCoordinates[estadoId];
      globalMapInstance.flyTo({
        center: [longitude, latitude],
        zoom: 6,
        essential: true,
        duration: 1500,
      });
    } catch (error) {
      console.error('Error flying to state:', error);
    }
  }, []);

  // Reset map view
  const resetMapView = useCallback(() => {
    if (!globalMapInstance) return;

    try {
      globalMapInstance.flyTo({
        center: [-55.491477, -13.720512],
        zoom: 4,
        essential: true,
        duration: 1500,
      });
    } catch (error) {
      console.error('Error resetting map view:', error);
    }
  }, []);

  return {
    mapRef: { current: globalMapInstance }, // Retornamos a instância global como se fosse um ref
    mapContainerRef,
    isMapLoaded,
    mapError,
    flyToState,
    resetMapView,
    activeLayers,
    toggleLayerVisibility,
    updateLayerData,
    initializedPatterns,
    allPatternsInitialized,
  };
};
