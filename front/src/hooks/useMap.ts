import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { statesCoordinates } from '../utils/coordenadasEstados';
import { HeatMapPattern } from '../patterns/FocosCalorPattern';
import { BiomaPattern } from '../patterns/BiomaPattern';
import { QueimadaPattern } from '../patterns/QueimadaPattern';
import { RiscoFogoPattern } from '../patterns/RiscoFogoPattern';
import { patterns, PatternType } from '../types';
import { biomeCoordinates } from '../utils/coordenadasBiomas';
import { TilesetPattern } from '../patterns/TileSetPattern';
import { EstadoPattern } from '../patterns/EstadoPattern';

// Armazena o mapa globalmente para garantir que esteja sempre acessível
let globalMapInstance: mapboxgl.Map | null = null;

// Criar instâncias das classes Pattern
const heatMapPattern = new HeatMapPattern();
const biomaPattern = new BiomaPattern();
const queimadaPattern = new QueimadaPattern();
const riscoFogoPattern = new RiscoFogoPattern();
const tilesetPattern = new TilesetPattern();
const estadoPattern = new EstadoPattern();

export const useMap = (initialOptions = {}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [activeLayers, setActiveLayers] = useState<PatternType[]>([
    PatternType.BIOMA, // Adicionar bioma como camada ativa por padrão
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
    console.log('🚀 Starting pattern initialization...');
    
    const patternInitializers = [
      {
        type: PatternType.BIOMA,
        pattern: biomaPattern,
        visible: true,
        priority: 1
      },
      {
        type: PatternType.HEAT_MAP,
        pattern: heatMapPattern,
        visible: activeLayers.includes(PatternType.HEAT_MAP),
        priority: 2
      },
      {
        type: PatternType.ESTADO,
        pattern: estadoPattern,
        visible: activeLayers.includes(PatternType.ESTADO),
        priority: 3
      },
      {
        type: PatternType.QUEIMADA,
        pattern: queimadaPattern,
        visible: activeLayers.includes(PatternType.QUEIMADA),
        priority: 4
      },
      {
        type: PatternType.RISCO_FOGO,
        pattern: tilesetPattern,
        visible: activeLayers.includes(PatternType.RISCO_FOGO),
        priority: 5
      },
    ];

    patternInitializers.sort((a, b) => a.priority - b.priority);

    const results: (PatternType | null)[] = [];

    // Initialize patterns sequentially with extended delays for problematic patterns
    for (const { type, pattern, visible } of patternInitializers) {
      try {
        console.log(`🔄 Initializing ${type}...`);
        
        // Special handling for EstadoPattern
        if (type === PatternType.ESTADO) {
          console.log('🏛️ Special initialization for EstadoPattern...');
          
          // Wait extra time before initializing EstadoPattern
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Verify map is still ready
          if (!map.loaded() || !map.isStyleLoaded()) {
            console.error('🏛️ Map not ready for EstadoPattern initialization');
            throw new Error('Map not ready for EstadoPattern');
          }
          
          console.log('🏛️ Map verified ready, proceeding with EstadoPattern init...');
        }
        
        await pattern.initialize(map);
        
        // Extended delay after EstadoPattern initialization
        const delay = type === PatternType.ESTADO ? 300 : 100;
        await new Promise((resolve) => setTimeout(resolve, delay));
        
        pattern.setVisibility(map, visible);
        console.log(`✅ ${type} inicializado com sucesso!`);
        results.push(type);
        
      } catch (error) {
        console.error(`❌ Erro ao inicializar ${type}:`, error);
        
        // For EstadoPattern, try once more
        if (type === PatternType.ESTADO) {
          console.log('🏛️ Tentando reinicializar EstadoPattern...');
          try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await pattern.initialize(map);
            pattern.setVisibility(map, visible);
            console.log(`✅ ${type} inicializado com sucesso na segunda tentativa!`);
            results.push(type);
          } catch (retryError) {
            console.error(`❌ EstadoPattern falhou na segunda tentativa:`, retryError);
            results.push(null);
          }
        } else {
          results.push(null);
        }
      }
    }

    const initialized = results.filter(Boolean) as PatternType[];
    setInitializedPatterns(initialized);
    setAllPatternsInitialized(true);
    
    console.log('🎉 Pattern initialization completed. Results:', {
      initialized,
      failed: results.filter(r => r === null).length,
      total: results.length
    });
  };

  // Toggle layer visibility using pattern classes
  const toggleLayerVisibility = useCallback(
    (patternType: PatternType) => {
      console.log('Tentando alternar visibilidade para:', patternType);
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
            // riscoFogoPattern.setVisibility(
            //   globalMapInstance,
            //   !isCurrentlyActive,
            // );
            tilesetPattern.setVisibility(
              globalMapInstance,
              !isCurrentlyActive,
            );
            break;
          case PatternType.ESTADO:
            estadoPattern.setVisibility(globalMapInstance, !isCurrentlyActive);
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
        case PatternType.ESTADO:
          estadoPattern.update(map, validData);
          estadoPattern.setVisibility(map, true);
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

  const flyToBioma = useCallback((biomaId: number) => {
    if (!globalMapInstance || !biomeCoordinates[biomaId]) return;

    try {
      const { latitude, longitude } = biomeCoordinates[biomaId];
      globalMapInstance.flyTo({
        center: [longitude, latitude],
        zoom: 5,
        essential: true,
        duration: 1500,
      });
    } catch (error) {
      console.error('Error flying to bioma:', error);
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
    flyToBioma,
    resetMapView,
    activeLayers,
    toggleLayerVisibility,
    updateLayerData,
    initializedPatterns,
    allPatternsInitialized,
  };
};
