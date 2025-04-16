import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css';

function App() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYm9pdGF0YSIsImEiOiJjbTlrZGF3ejgwb2FxMnJvYWZ1Z3pudndpIn0.EiV7WmRDDZZBkY2A0PSJ1A';
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-55.491477, -13.720512],
      zoom: 4,
      attributionControl: false,
      logoPosition: 'top-right',
    });

    mapRef.current.on('load', () => {
     
      mapRef.current.addSource('country-boundaries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      });

     
      mapRef.current.addLayer({
        id: 'brazil-boundary',
        type: 'fill',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        filter: ['==', 'iso_3166_1', 'BR'],
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.1,
          'fill-outline-color': '#000',
        },
      });
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />
    </>
  );
}

export default App;