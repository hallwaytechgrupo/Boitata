import { useEffect, useRef } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Map } from 'mapbox-gl';

interface UseDrawProps {
  map: Map | null;
  onDrawCreate?: (e: any) => void;
  onDrawUpdate?: (e: any) => void;
  onDrawDelete?: (e: any) => void;
  drawOptions?: Omit<mapboxgl.MapboxDraw, "displayControlsDefault" | "controls">['controls']
  defaultMode?: mapboxgl.MapboxDraw['options']['defaultMode']
}

const useDraw = ({ map, onDrawCreate, onDrawUpdate, onDrawDelete, drawOptions, defaultMode }: UseDrawProps) => {
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (map) {
      drawRef.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: drawOptions,
        defaultMode: defaultMode
      });

      map.addControl(drawRef.current);

      if (onDrawCreate) map.on('draw.create', onDrawCreate);
      if (onDrawUpdate) map.on('draw.update', onDrawUpdate);
      if (onDrawDelete) map.on('draw.delete', onDrawDelete);
    }

    return () => {
      if (map) {
        if (onDrawCreate) map.off('draw.create', onDrawCreate);
        if (onDrawUpdate) map.off('draw.update', onDrawUpdate);
        if (onDrawDelete) map.off('draw.delete', onDrawDelete);
        if (drawRef.current) map.removeControl(drawRef.current);
      }
    };
  }, [map, onDrawCreate, onDrawUpdate, onDrawDelete, drawOptions, defaultMode]);

  return drawRef;
};

export default useDraw;