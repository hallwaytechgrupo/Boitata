import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseMapProps {
  containerRef: React.RefObject<HTMLDivElement>;
  style?: string;
  center?: [number, number];
  zoom?: number;
  accessToken: string;
}

const useMap = ({ containerRef, style, center, zoom, accessToken }: UseMapProps) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Persist map instance

  useEffect(() => {
    if (containerRef.current) {
      mapboxgl.accessToken = accessToken;
      try {
        const newMap = new mapboxgl.Map({
          container: containerRef.current,
          style: style || 'mapbox://styles/mapbox/dark-v11',
          center: center || [-55.491477, -13.720512],
          zoom: zoom || 4,
          attributionControl: false,
          logoPosition: "top-right",
        });

        setMap(newMap);
        mapRef.current = newMap; // Store in ref
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }

    return () => {
      mapRef.current?.remove();
    };
  }, [containerRef, style, center, zoom, accessToken]);

  return { map, mapRef };
};

export default useMap;