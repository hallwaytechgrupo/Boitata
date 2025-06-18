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

    console.log('🏛️ EstadoPattern.initialize START - Map loaded:', map.loaded(), 'Style loaded:', map.isStyleLoaded());

    // Check if already initialized
    if (this.initialized) {
      console.log('🏛️ EstadoPattern already initialized, skipping...');
      return Promise.resolve();
    }

    // Force wait for map to be completely ready with longer timeout
    await this.waitForMapReady(map);
    
    return this.initializeLayer(map);
  }

  private async waitForMapReady(map: mapboxgl.Map): Promise<void> {
    console.log('🏛️ Waiting for map to be ready...');
    
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max
      
      const checkReady = () => {
        attempts++;
        console.log(`🏛️ Check attempt ${attempts}/${maxAttempts} - loaded: ${map.loaded()}, styleLoaded: ${map.isStyleLoaded()}, hasStyle: ${!!map.getStyle()}`);
        
        if (map.loaded() && map.isStyleLoaded() && map.getStyle()) {
          console.log('🏛️ Map is fully ready after', attempts, 'attempts');
          resolve();
        } else if (attempts >= maxAttempts) {
          console.error('🏛️ Map ready timeout after', attempts, 'attempts');
          reject(new Error('Map ready timeout'));
        } else {
          setTimeout(checkReady, 100);
        }
      };
      
      checkReady();
    });
  }

  private async initializeLayer(map: mapboxgl.Map): Promise<void> {
    console.log('🏛️ initializeLayer START');
    
    try {
      // Force cleanup first
      await this.forceCleanup(map);
      
      // Wait extra time to ensure map is stable
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log('🏛️ Adding source...');
      
      // Add source with retry logic
      await this.addSourceWithRetry(map);
      
      console.log('🏛️ Adding layers...');
      
      // Add layers with retry logic
      await this.addLayersWithRetry(map);
      
      console.log('🏛️ Adding event listeners...');
      
      // Add event listeners
      this.addEventListeners(map);

      this.initialized = true;
      console.log('🏛️ EstadoPattern inicializado com SUCESSO!');
      
    } catch (error) {
      console.error('🏛️ ERRO CRÍTICO ao inicializar EstadoPattern:', error);
      this.initialized = false;
      throw error;
    }
  }

  private async forceCleanup(map: mapboxgl.Map): Promise<void> {
    console.log('🏛️ Force cleanup starting...');
    
    try {
      // Remove layers if they exist
      if (map.getLayer(this.outlineLayerId)) {
        console.log('🏛️ Removing existing outline layer');
        map.removeLayer(this.outlineLayerId);
      }

      if (map.getLayer(this.layerId)) {
        console.log('🏛️ Removing existing fill layer');
        map.removeLayer(this.layerId);
      }

      // Remove source if it exists
      if (map.getSource(this.sourceId)) {
        console.log('🏛️ Removing existing source');
        map.removeSource(this.sourceId);
      }

      console.log('🏛️ Force cleanup completed');
    } catch (error) {
      console.warn('🏛️ Error during force cleanup (not critical):', error);
    }
  }

  private async addSourceWithRetry(map: mapboxgl.Map): Promise<void> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        if (!map.getSource(this.sourceId)) {
          map.addSource(this.sourceId, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });
          console.log('🏛️ Source added successfully on attempt', attempt + 1);
          return;
        } else {
          console.log('🏛️ Source already exists');
          return;
        }
      } catch (error) {
        attempt++;
        console.error(`🏛️ Failed to add source on attempt ${attempt}:`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          throw error;
        }
      }
    }
  }

  private async addLayersWithRetry(map: mapboxgl.Map): Promise<void> {
    const maxRetries = 3;
    
    // Add fill layer
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
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
          console.log('🏛️ Fill layer added successfully on attempt', attempt + 1);
          break;
        } else {
          console.log('🏛️ Fill layer already exists');
          break;
        }
      } catch (error) {
        attempt++;
        console.error(`🏛️ Failed to add fill layer on attempt ${attempt}:`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          throw error;
        }
      }
    }

    // Add outline layer
    attempt = 0;
    while (attempt < maxRetries) {
      try {
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
          console.log('🏛️ Outline layer added successfully on attempt', attempt + 1);
          break;
        } else {
          console.log('🏛️ Outline layer already exists');
          break;
        }
      } catch (error) {
        attempt++;
        console.error(`🏛️ Failed to add outline layer on attempt ${attempt}:`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          throw error;
        }
      }
    }
  }

  private addEventListeners(map: mapboxgl.Map): void {
    try {
      const clickHandler = (e: any) => {
        try {
          if (e.features && e.features.length > 0) {
            const properties = e.features[0].properties;
            console.log('🏛️ Estado clicked:', properties);
            
            const event = new CustomEvent('stateClick', {
              detail: { properties, coordinates: e.lngLat }
            });
            window.dispatchEvent(event);
          }
        } catch (error) {
          console.error('🏛️ Error in click handler:', error);
        }
      };

      map.on('click', this.layerId, clickHandler);
      
      map.on('mouseenter', this.layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      
      map.on('mouseleave', this.layerId, () => {
        map.getCanvas().style.cursor = '';
      });

      console.log('🏛️ Event listeners added successfully');
    } catch (error) {
      console.error('🏛️ Failed to add event listeners:', error);
      throw error;
    }
  }

  update(map: mapboxgl.Map, data: GeoJSON.FeatureCollection): void {
    if (!map) {
      console.warn('🏛️ Map instance not available for update');
      return;
    }

    if (!this.initialized) {
      console.warn('🏛️ EstadoPattern not initialized, attempting to initialize...');
      this.initialize(map).then(() => {
        this.update(map, data);
      }).catch(error => {
        console.error('🏛️ Failed to initialize during update:', error);
      });
      return;
    }

    try {
      console.log('🏛️ Atualizando dados de estados:', data?.features?.length || 0, 'features');
      
      const source = map.getSource(this.sourceId) as mapboxgl.GeoJSONSource;
      if (source && source.setData) {
        source.setData(data);
        console.log('🏛️ Dados de estados atualizados com sucesso');
      } else {
        console.error('🏛️ Source not found or setData method not available');
      }
    } catch (error) {
      console.error('🏛️ Erro ao atualizar dados de estados:', error);
    }
  }

  setVisibility(map: mapboxgl.Map, visible: boolean): void {
    if (!map) {
      console.warn('🏛️ Map instance not available for visibility change');
      return;
    }

    if (!this.initialized) {
      console.warn('🏛️ EstadoPattern not initialized for visibility change');
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
      console.error('🏛️ Erro ao definir visibilidade de estados:', error);
    }
  }

  cleanup(map: mapboxgl.Map): void {
    if (!map) return;

    try {
      // Remove event listeners
      if (map.getLayer(this.layerId)) {
        map.off('click', this.layerId);
        map.off('mouseenter', this.layerId);
        map.off('mouseleave', this.layerId);
      }

      // Remove layers
      if (map.getLayer(this.outlineLayerId)) {
        map.removeLayer(this.outlineLayerId);
      }

      if (map.getLayer(this.layerId)) {
        map.removeLayer(this.layerId);
      }

      // Remove source
      if (map.getSource(this.sourceId)) {
        map.removeSource(this.sourceId);
      }

      this.initialized = false;
      console.log('🏛️ EstadoPattern limpo com sucesso');
    } catch (error) {
      console.error('🏛️ Erro ao limpar EstadoPattern:', error);
      // Force reset initialized state even if cleanup fails
      this.initialized = false;
    }
  }
}
