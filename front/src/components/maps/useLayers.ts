import { useEffect, useRef } from 'react';
import { Map, LayerSpecification, GeoJSONSource, GeoJSONSourceRaw } from 'mapbox-gl';

interface UseLayersProps {
  map: Map | null;
  layers: LayerSpecification[];
  sourceData?: GeoJSON.FeatureCollection | GeoJSONSourceRaw | null;
  sourceId?: string;
}

const useLayers = ({ map, layers, sourceData, sourceId }: UseLayersProps) => {
  const layerIds = useRef<string[]>([]);

  useEffect(() => {
    if (!map) return;

    // Remove old layers
    layerIds.current.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    });
    layerIds.current = [];

    // Update source data if provided
    if (sourceData && sourceId && map.getSource(sourceId)) {
      (map.getSource(sourceId) as GeoJSONSource).setData(sourceData as GeoJSON.FeatureCollection);
    }

    // Add new layers
    layers.forEach(layer => {
      try {
        map.addLayer(layer);
        layerIds.current.push(layer.id);
      } catch (error) {
        console.error("Error adding layer:", error);
      }

    });

    return () => {
      // Remove layers on unmount
      layerIds.current.forEach(layerId => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
      });
    };
  }, [map, layers, sourceData, sourceId]);
};

export default useLayers;