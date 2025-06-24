import mapboxgl from 'mapbox-gl';
import type { MapPattern } from '../types';

export class HeatMapPattern implements MapPattern {
  id = 'heatmap';
  name = 'Focos de Calor';
  description = 'Visualização de focos de calor no formato de mapa de calor';

  sourceId = 'geojson-data';
  layerId = 'frp-heatmap';
  initialized = false;

  async initialize(map: mapboxgl.Map): Promise<void> {
    if (!map) throw new Error('Map instance is required');

    // Verificar se o mapa está pronto
    if (!map.loaded()) {
      console.log('Map not fully loaded yet, waiting...');
      return new Promise((resolve, reject) => {
        const onLoad = () => {
          map.off('load', onLoad);
          this.initializeLayer(map).then(resolve).catch(reject);
        };

        if (map.loaded()) {
          this.initializeLayer(map).then(resolve).catch(reject);
        } else {
          map.on('load', onLoad);
        }
      });
    }
    return this.initializeLayer(map);
  }

  private async initializeLayer(map: mapboxgl.Map): Promise<void> {
    try {
      // Verificar se a fonte já existe
      if (!map.getSource(this.sourceId)) {
        // Adiciona a fonte de dados
        map.addSource(this.sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });
      }

      // Verificar se a camada já existe
      if (!map.getLayer(this.layerId)) {
        // Adiciona a camada de heatmap
        map.addLayer({
          id: this.layerId,
          type: 'heatmap',
          source: this.sourceId,
          paint: {
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'frp'],
              0,
              0,
              50,
              0.5,
              100,
              1,
            ],
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              10,
              9,
              20,
              12,
              25,
            ],
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              0.8,
              10,
              0.6,
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(33, 102, 172, 0)',
              0.1,
              'rgb(103, 169, 207)',
              0.3,
              'rgb(209, 229, 240)',
              0.5,
              'rgb(253, 219, 199)',
              0.7,
              'rgb(239, 138, 98)',
              0.9,
              'rgb(178, 24, 43)',
            ],
          },
        });

        // map.addLayer({
        //   id: 'frp-circles',
        //   type: 'circle',
        //   source: this.sourceId,
        //   minzoom: 9,
        //   paint: {
        //     'circle-radius': [
        //       'interpolate',
        //       ['linear'],
        //       ['get', 'frp'],
        //       0,
        //       5, // FRP 0 → raio 5px
        //       100,
        //       15, // FRP 100 → raio 15px
        //     ],
        //     'circle-color': [
        //       'interpolate',
        //       ['linear'],
        //       ['get', 'frp'],
        //       0,
        //       '#FFFFB2', // FRP 0 → amarelo claro
        //       50,
        //       '#FECC5C', // FRP 50 → amarelo intenso
        //       100,
        //       '#E31A1C', // FRP 100 → vermelho
        //     ],
        //     'circle-opacity': 0.7,
        //     'circle-stroke-width': 1,
        //     'circle-stroke-color': '#FFFFFF', // Borda branca para destaque
        //   },
        // });

        // Adiciona eventos de clique

        map.on('click', this.layerId, (e) => {
          if (e.features && e.features.length > 0) {
            const properties = e.features[0].properties;

            new mapboxgl.Popup({ closeOnClick: true })
              .setLngLat(e.lngLat)
              .setHTML(`
                <strong>FRP:</strong> ${properties?.frp ?? 0}<br/>
                <strong>Data:</strong> ${properties?.data ?? 0}<br/>
                <strong>Risco:</strong> ${properties?.risco ?? 0}<br/>
                <strong>Satélite:</strong> ${properties?.satelite ?? 0}<br/>
                <strong>Município:</strong> ${properties?.municipio ?? 0}
              `)
              .addTo(map);
          }
        });
      }

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing heatmap layer:', error);
      throw error;
    }
  }

  update(map: mapboxgl.Map, data: GeoJSON.FeatureCollection): void {
    if (!map || !this.initialized) return;

    try {
      const source = map.getSource(this.sourceId) as mapboxgl.GeoJSONSource;
      if (source?.setData) {
        source.setData(data);
      }
    } catch (error) {
      console.error('Error updating heatmap data:', error);
    }
  }

  setVisibility(map: mapboxgl.Map, visible: boolean): void {
    if (!map || !this.initialized) return;

    try {
      if (map.getLayer(this.layerId)) {
        map.setLayoutProperty(
          this.layerId,
          'visibility',
          visible ? 'visible' : 'none',
        );
      }
    } catch (error) {
      console.error('Error setting heatmap visibility:', error);
    }
  }

  cleanup(map: mapboxgl.Map): void {
    if (!map) return;

    try {
      if (map.getLayer(this.layerId)) {
        map.off('click', this.layerId);
        map.removeLayer(this.layerId);
      }

      if (map.getSource(this.sourceId)) {
        map.removeSource(this.sourceId);
      }

      this.initialized = false;
    } catch (error) {
      console.error('Error cleaning up heatmap:', error);
    }
  }
}
