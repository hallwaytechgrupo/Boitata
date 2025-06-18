import mapboxgl from 'mapbox-gl';
import type { LocationType, MapPattern } from '../types';

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
  }  private async _initialize(map: mapboxgl.Map): Promise<void> {
    try {
      console.log('Starting BiomaPattern initialization...');
      console.log('Map loaded status:', map.loaded());
      
      // O mapa já deve estar carregado quando chegamos aqui
      // Não precisamos aguardar novamente// Carrega os dados do bioma
      console.log('Loading bioma data...');
      const response = await fetch('bioma.json');
      if (!response.ok) {
        console.error('Failed to fetch bioma.json:', response.status, response.statusText);
        throw new Error(`Failed to load biomas.geojson: ${response.status}`);
      }

      const geojson = await response.json();
      console.log('Biomas GeoJSON loaded successfully:', {
        type: geojson.type,
        featuresCount: geojson.features?.length || 0,
        firstFeature: geojson.features?.[0]
      });      // Adiciona a fonte de dados com os dados carregados
      if (!map.getSource(this.sourceId)) {
        console.log('Adding bioma source to map...');
        map.addSource(this.sourceId, {
          type: 'geojson',
          data: geojson,
          promoteId: 'id_bioma',
        });
        console.log('Added BiomaPattern source to map');
      } else {
        console.log('Bioma source already exists, updating data...');
        const source = map.getSource(this.sourceId) as mapboxgl.GeoJSONSource;
        source.setData(geojson);
      }

      // Adiciona as camadas diretamente
      console.log('Adding bioma layers...');
      this.addLayers(map);

      console.log('BiomaPattern initialization completed successfully');
    } catch (error) {
      console.error('Erro ao carregar os biomas:', error);
      // Reset initialization state on error
      this.initializationPromise = null;
      throw error;
    }
  }
  private addLayers(map: mapboxgl.Map): void {
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
          visibility: 'visible', // Garantir que inicia visível
        },
        paint: {
          'fill-color': [
            'match',
            ['get', 'id_bioma'],
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
          'fill-opacity': 0.3, // Aumentar opacidade para melhor visualização
          'fill-outline-color': '#000',
        },
      }, 'admin-0-boundary');
      console.log('Added bioma fill layer with visibility: visible');
    }

    // Adiciona camada de rótulos
    if (!map.getLayer(this.labelLayerId)) {
      map.addLayer({
        id: this.labelLayerId,
        type: 'symbol',
        source: this.sourceId,
        layout: {
          'text-field': ['get', 'bioma'],
          'text-size': 12,
          'text-allow-overlap': false, // Evitar sobreposição excessiva
          visibility: 'visible', // Garantir que inicia visível
        },
        paint: {
          'text-color': '#000',
          'text-halo-color': '#fff',
          'text-halo-width': 2, // Aumentar halo para melhor legibilidade
        },
      }, 'admin-1-boundary');
      console.log('Added bioma label layer with visibility: visible');
    }

    // Adiciona interatividade
    this.addInteractivity(map);
    
    // Set initialized flag to true after everything is complete
    this.initialized = true;
    console.log('BiomaPattern layers added and initialized successfully');
  }

  private addInteractivity(map: mapboxgl.Map): void {
    map.on('mouseenter', this.fillLayerId, () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', this.fillLayerId, () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('click', this.fillLayerId, (e) => {
      if (e.features && e.features.length > 0) {
        const bioma = e.features[0].properties as { bioma: string; id_bioma: number };
        console.log('Clicked on bioma:', bioma);
        if (!bioma) return;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <p>ID: ${bioma.id_bioma}</p>
            <h3>${bioma.bioma}</h3>
          `)
          .addTo(map);
      }
    });
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
        // Remove all listeners for this layer
        map.getCanvas().style.cursor = '';
        map.removeLayer(this.fillLayerId);
      }

      if (map.getSource(this.sourceId)) {
        map.removeSource(this.sourceId);
      }

      this.initialized = false;
      this.initializationPromise = null;
    } catch (error) {
      console.error('Error cleaning up bioma layers:', error);
    }
  }
}
