import mapboxgl from 'mapbox-gl';
import type { MapPattern } from '../types';

export class EstadoPattern implements MapPattern {
  id = 'estado';
  name = 'Estados';
  description = 'Visualização dos estados brasileiros';

  sourceId = 'estados-geojson';
  layerId = 'estados-fill';
  outlineLayerId = 'estados-outline';
  initialized = false;

  async initialize(map: mapboxgl.Map): Promise<void> {
    if (!map) throw new Error('Map instance is required');

    console.log('🏛️ EstadoPattern.initialize chamado, map.loaded():', map.loaded());

    if (!map.loaded()) {
      console.log('🏛️ Mapa não carregado, aguardando evento load...');
      return new Promise((resolve, reject) => {
        const onLoad = () => {
          console.log('🏛️ Evento load disparado, inicializando camada...');
          map.off('load', onLoad);
          this.initializeLayer(map).then(resolve).catch(reject);
        };
        map.on('load', onLoad);
        
        // Fallback: se o mapa já estiver carregado mas o evento não disparar
        setTimeout(() => {
          if (map.loaded() && !this.initialized) {
            console.log('🏛️ Fallback: forçando inicialização...');
            map.off('load', onLoad);
            this.initializeLayer(map).then(resolve).catch(reject);
          }
        }, 100);
      });
    }
    return this.initializeLayer(map);
  }

  private async initializeLayer(map: mapboxgl.Map): Promise<void> {
    try {
      console.log('🏛️ Inicializando camada de estados...');
      
      // Verificar se o mapa está realmente pronto
      if (!map || !map.getStyle()) {
        throw new Error('Mapa não está pronto para adicionar camadas');
      }

      if (!map.getSource(this.sourceId)) {
        map.addSource(this.sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
        console.log('🏛️ Fonte de dados de estados criada');
      }

      if (!map.getLayer(this.layerId)) {
        map.addLayer({
          id: this.layerId,
          type: 'fill',
          source: this.sourceId,
          paint: {
            'fill-color': '#1e40af',
            'fill-opacity': 0.3,
          },
        });
        console.log('🏛️ Camada de preenchimento de estados criada');
      }

      if (!map.getLayer(this.outlineLayerId)) {
        map.addLayer({
          id: this.outlineLayerId,
          type: 'line',
          source: this.sourceId,
          paint: {
            'line-color': '#1e40af',
            'line-width': 2,
            'line-opacity': 0.8,
          },
        });
        console.log('🏛️ Camada de contorno de estados criada');
      }

      // Add click event with error handling
      try {
        map.on('click', this.layerId, (e) => {
          try {
            if (e.features && e.features.length > 0) {
              const properties = e.features[0].properties;
              console.log('🏛️ Clique detectado no estado:', properties);
            }
          } catch (clickError) {
            console.error('Erro ao processar clique no estado:', clickError);
          }
        });
        console.log('🏛️ Eventos de clique adicionados');
      } catch (eventError) {
        console.error('Erro ao adicionar eventos de clique:', eventError);
      }

      this.initialized = true;
      console.log('🏛️ EstadoPattern inicializado com sucesso! initialized:', this.initialized);
    } catch (error) {
      console.error('Erro ao inicializar camada de estados:', error);
      this.initialized = false;
      throw error;
    }
  }

  update(map: mapboxgl.Map, data: GeoJSON.FeatureCollection): void {
    if (!map || !this.initialized) {
      console.warn('🏛️ Mapa ou padrão não inicializado para atualização');
      return;
    }

    try {
      console.log('🏛️ Atualizando dados de estados:', data);
      const source = map.getSource(this.sourceId) as mapboxgl.GeoJSONSource;
      if (source?.setData) {
        source.setData(data);
        console.log('🏛️ Dados de estados atualizados com sucesso');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados de estados:', error);
    }
  }

  setVisibility(map: mapboxgl.Map, visible: boolean): void {
    console.log('mapboxgl.Map:', map);
    if (!map || !this.initialized) {
      console.warn('🏛️ Mapa ou padrão não inicializado para visibilidade');
      return;
    }

    try {
      const visibility = visible ? 'visible' : 'none';
      
      if (map.getLayer(this.layerId)) {
        map.setLayoutProperty(this.layerId, 'visibility', visibility);
      }
      
      if (map.getLayer(this.outlineLayerId)) {
        map.setLayoutProperty(this.outlineLayerId, 'visibility', visibility);
      }
      
      console.log(`🏛️ Visibilidade de estados definida como: ${visible}`);
    } catch (error) {
      console.error('Erro ao definir visibilidade de estados:', error);
    }
  }

  cleanup(map: mapboxgl.Map): void {
    if (!map) return;

    try {
      if (map.getLayer(this.layerId)) {
        map.off('click', this.layerId);
        map.removeLayer(this.layerId);
      }

      if (map.getLayer(this.outlineLayerId)) {
        map.removeLayer(this.outlineLayerId);
      }

      if (map.getSource(this.sourceId)) {
        map.removeSource(this.sourceId);
      }

      this.initialized = false;
      console.log('🏛️ EstadoPattern limpo com sucesso');
    } catch (error) {
      console.error('Erro ao limpar EstadoPattern:', error);
    }
  }
}
