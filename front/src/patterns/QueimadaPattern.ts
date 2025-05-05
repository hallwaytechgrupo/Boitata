import mapboxgl from 'mapbox-gl';
import type { MapPattern } from './types';

export class QueimadaPattern implements MapPattern {
  id = 'queimada';
  name = 'Áreas Queimadas';
  description = 'Visualização de áreas queimadas';

  sourceId = 'queimada-source';
  layerId = 'queimada-layer';

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

    // Adiciona a camada de áreas queimadas
    if (!map.getLayer(this.layerId)) {
      map.addLayer({
        id: this.layerId,
        type: 'fill',
        source: this.sourceId,
        layout: {
          visibility: 'none', // Inicialmente invisível
        },
        paint: {
          'fill-color': '#8B0000', // Cor vermelho escuro
          'fill-opacity': 0.6,
          'fill-outline-color': '#FF0000', // Contorno vermelho
        },
      });

      // Adiciona eventos de clique
      map.on('click', this.layerId, (e) => {
        if (e.features && e.features.length > 0) {
          const properties = e.features[0].properties;

          new mapboxgl.Popup({ closeOnClick: true })
            .setLngLat(e.lngLat)
            .setHTML(`
              <strong>Área:</strong> ${properties?.area ?? 0} km²<br/>
              <strong>Data:</strong> ${properties?.data ?? 'N/A'}<br/>
              <strong>Severidade:</strong> ${properties?.severidade ?? 'N/A'}<br/>
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
