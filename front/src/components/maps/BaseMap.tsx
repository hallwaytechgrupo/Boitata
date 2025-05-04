import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface BaseMapProps {
  children?: React.ReactNode;
  style?: string;
  center?: [number, number];
  zoom?: number;
}

const BaseMap: React.FC<BaseMapProps> = ({ children, style, center, zoom }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Substitua pela sua chave
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: style || 'mapbox://styles/mapbox/dark-v11',
        center: center || [-55.491477, -13.720512],
        zoom: zoom || 4,
      });
    }

    return () => {
      mapRef.current?.remove();
    };
  }, [style, center, zoom]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }}>
      {children}
    </div>
  );
};

export default BaseMap;