import mapboxgl from 'mapbox-gl';
import type { LocationType, MapPattern } from '../types';
import { getBiomasShp } from '../services/api';

export class BiomaPattern implements MapPattern {
  id = 'bioma';
  name = 'Biomas';
  description = 'Visualização de biomas brasileiros';

  sourceId = 'bioma-layer';
  fillLayerId = 'bioma-fill';
  labelLayerId = 'bioma-label';

  // Flag to track if pattern is initialized
  initialized = false;

  // Promise to track initialization completion
  initializationPromise: Promise<void> | null = null;

  async initialize(map: mapboxgl.Map): Promise<void> {
    // If already initializing, return the existing promise
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    // Create and store the initialization promise
    this.initializationPromise = this._initialize(map);
    return this.initializationPromise;
  }

  private async _initialize(map: mapboxgl.Map): Promise<void> {
    try {
      console.log('Starting BiomaPattern initialization...');
      const geojson = await getBiomasShp();

      // Wait for the map to be loaded
      if (!map.loaded()) {
        await new Promise<void>((resolve) => {
          map.once('load', () => resolve());
        });
      }

      // Adiciona a fonte de dados
      if (!map.getSource(this.sourceId)) {
        map.addSource(this.sourceId, {
          type: 'geojson',
          data: geojson,
          promoteId: 'id',
        });
        console.log('Added BiomaPattern source to map');
      }

      const biomaColors = {
        1: '#1E8449', // Amazônia - Verde escuro
        2: '#F39C12', // Caatinga - Laranja
        3: '#27AE60', // Cerrado - Verde
        4: '#2ECC71', // Mata Atlântica - Verde claro
        5: '#F1C40F', // Pampa - Amarelo
        6: '#3498DB', // Pantanal - Azul
      };

      // Adiciona camada de preenchimento
      if (!map.getLayer(this.fillLayerId)) {
        map.addLayer({
          id: this.fillLayerId,
          type: 'fill',
          source: this.sourceId,
          layout: {
            visibility: 'visible',
          },
          paint: {
            'fill-color': [
              'match',
              ['get', 'id'],
              1,
              biomaColors[1],
              2,
              biomaColors[2],
              3,
              biomaColors[3],
              4,
              biomaColors[4],
              5,
              biomaColors[5],
              6,
              biomaColors[6],
              '#CCC',
            ],
            'fill-opacity': 0.2,
            'fill-outline-color': '#000',
          },
        });
      }

      // Adiciona camada de rótulos
      if (!map.getLayer(this.labelLayerId)) {
        map.addLayer({
          id: this.labelLayerId,
          type: 'symbol',
          source: this.sourceId,
          layout: {
            'text-field': ['get', 'nome_bioma'],
            'text-size': 12,
            'text-allow-overlap': true,
            visibility: 'visible',
          },
          paint: {
            'text-color': '#000',
            'text-halo-color': '#fff',
            'text-halo-width': 2,
          },
        });
      }

      // Adiciona interatividade
      map.on('mouseenter', this.fillLayerId, () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', this.fillLayerId, () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', this.fillLayerId, (e) => {
        if (e.features && e.features.length > 0) {
          const bioma = e.features[0].properties as LocationType | null;
          if (!bioma) return;

          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <h3>${bioma.nome}</h3>
              <p>ID: ${bioma.id}</p>
            `)
            .addTo(map);
        }
      });

      // Set initialized flag to true after everything is complete
      this.initialized = true;
      console.log('BiomaPattern initialization completed successfully');
    } catch (error) {
      console.error('Erro ao carregar os biomas:', error);
      // Reset initialization state on error
      this.initializationPromise = null;
      throw error;
    }
  }

  async setVisibility(map: mapboxgl.Map, visible: boolean): Promise<void> {
    // If not initialized, try to initialize first
    if (!this.initialized) {
      console.log(
        'BiomaPattern not initialized yet, attempting to initialize before setting visibility',
      );
      try {
        await this.initialize(map);
      } catch (error) {
        console.error('Failed to initialize BiomaPattern:', error);
        return;
      }
    }

    try {
      if (map.getLayer(this.fillLayerId)) {
        map.setLayoutProperty(
          this.fillLayerId,
          'visibility',
          visible ? 'visible' : 'none',
        );
        console.log(
          `Set ${this.fillLayerId} visibility to ${visible ? 'visible' : 'none'}`,
        );
      } else {
        console.warn(`Layer ${this.fillLayerId} not found in map`);
      }

      if (map.getLayer(this.labelLayerId)) {
        map.setLayoutProperty(
          this.labelLayerId,
          'visibility',
          visible ? 'visible' : 'none',
        );
        console.log(
          `Set ${this.labelLayerId} visibility to ${visible ? 'visible' : 'none'}`,
        );
      } else {
        console.warn(`Layer ${this.labelLayerId} not found in map`);
      }
    } catch (error) {
      console.error('Error setting visibility for bioma layers:', error);
    }
  }

  update(map: mapboxgl.Map, data: any): void {
    const source = map.getSource(this.sourceId) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(data);
    }
  }

  cleanup(map: mapboxgl.Map): void {
    try {
      if (map.getLayer(this.labelLayerId)) {
        map.removeLayer(this.labelLayerId);
      }

      if (map.getLayer(this.fillLayerId)) {
        map.off('mouseenter', this.fillLayerId);
        map.off('mouseleave', this.fillLayerId);
        map.off('click', this.fillLayerId);
        map.removeLayer(this.fillLayerId);
      }

      if (map.getSource(this.sourceId)) {
        map.removeSource(this.sourceId);
      }

      this.initialized = false;
    } catch (error) {
      console.error('Error cleaning up bioma layers:', error);
    }
  }
}
