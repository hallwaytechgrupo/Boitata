import mapboxgl from 'mapbox-gl';
import type { MapPattern } from '../types';

export class TilesetPattern implements MapPattern {
  id = 'risco-fogo';
  name = 'Risco de Fogo';
  description = 'Visualização do tileset de risco de fogo (raster)';
  sourceId = 'risco-fogo-geotiff-source';
  layerId = 'risco-fogo-geotiff-layer';

  initialized = false;
  initializationPromise: Promise<void> | null = null;

  async initialize(map: mapboxgl.Map): Promise<void> {
    if (this.initializationPromise) return this.initializationPromise;
    this.initializationPromise = this._initialize(map);
    return this.initializationPromise;
  }

  private async _initialize(map: mapboxgl.Map): Promise<void> {
    try {
      // O mapa já deve estar carregado
      if (!map.getSource(this.sourceId)) {
        map.addSource(this.sourceId, {
          type: 'raster',
          url: 'mapbox://chrisf5m.0e3rcse2',
        });
      }

      if (!map.getLayer(this.layerId)) {
        map.addLayer({
          id: this.layerId,
          type: 'raster',
          source: this.sourceId,
          paint: {
            'raster-opacity': 0.5,
          },
          layout: {
            visibility: 'none',
          },
        });
      }

      this.initialized = true;
      console.log('TilesetPattern initialized');
    } catch (error) {
      this.initializationPromise = null;
      console.error('Failed to initialize TilesetPattern:', error);
      throw error;
    }
  }

  async setVisibility(map: mapboxgl.Map, visible: boolean): Promise<void> {
    if (!this.initialized) {
      try {
        await this.initialize(map);
      } catch {
        return;
      }
    }
    if (map.getLayer(this.layerId)) {
      map.setLayoutProperty(this.layerId, 'visibility', visible ? 'visible' : 'none');
    }
  }

  update(map: mapboxgl.Map, data: any): void {
    // Tileset raster não precisa de update dinâmico normalmente
  }

  cleanup(map: mapboxgl.Map): void {
    try {
      if (map.getLayer(this.layerId)) {
        map.removeLayer(this.layerId);
      }
      if (map.getSource(this.sourceId)) {
        map.removeSource(this.sourceId);
      }
      this.initialized = false;
      this.initializationPromise = null;
    } catch (error) {
      console.error('Error cleaning up TilesetPattern:', error);
    }
  }
}