import mapboxgl from 'mapbox-gl';
import type { MapPattern } from '../types';

export class RiscoFogoPattern implements MapPattern {
  id = 'risco-fogo';
  name = 'Risco de Fogo';
  description = 'Visualização de áreas com risco de fogo';

  sourceId = 'risco-fogo-source';
  layerId = 'risco-fogo-layer';

  async initialize(map: mapboxgl.Map): Promise<void> {
    // Adiciona a fonte de dados
    if (!map.getSource(this.sourceId)) {
      map.addSource(this.sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
    }

    // Adiciona a camada de risco de fogo
    if (!map.getLayer(this.layerId)) {
      map.addLayer({
        id: this.layerId,
        type: 'fill',
        source: this.sourceId,
        layout: {
          visibility: 'none', // Inicialmente invisível
        },
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'risco'],
            0,
            '#FFFF00', // Amarelo - risco baixo
            0.3,
            '#FFA500', // Laranja - risco médio
            0.6,
            '#FF4500', // Laranja avermelhado - risco alto
            0.9,
            '#FF0000', // Vermelho - risco muito alto
          ],
          'fill-opacity': 0.6,
          'fill-outline-color': '#000000',
        },
      });

      // Adiciona eventos de clique
      map.on('click', this.layerId, (e) => {
        if (e.features && e.features.length > 0) {
          const properties = e.features[0].properties;

          new mapboxgl.Popup({ closeOnClick: true })
            .setLngLat(e.lngLat)
            .setHTML(`
              <strong>Risco:</strong> ${properties?.risco_nivel ?? 'N/A'}<br/>
              <strong>Valor:</strong> ${properties?.risco ?? 0}<br/>
              <strong>Data:</strong> ${properties?.data ?? 'N/A'}<br/>
            `)
            .addTo(map);
        }
      });
    }
  }

  update(map: mapboxgl.Map, data: GeoJSON.FeatureCollection): void {
    const source = map.getSource(this.sourceId) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(data);
    }
  }

  setVisibility(map: mapboxgl.Map, visible: boolean): void {
    map.setLayoutProperty(
      this.layerId,
      'visibility',
      visible ? 'visible' : 'none',
    );
  }

  cleanup(map: mapboxgl.Map): void {
    if (map.getLayer(this.layerId)) {
      map.off('click', this.layerId);
      map.removeLayer(this.layerId);
    }

    if (map.getSource(this.sourceId)) {
      map.removeSource(this.sourceId);
    }
  }
}
