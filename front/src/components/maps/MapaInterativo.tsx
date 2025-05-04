import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import BaseMap from './BaseMap'; // Importe BaseMap

const MapaInterativo = () => {
  const draw = useRef<MapboxDraw | null>(null);
  const [polygonCoords, setPolygonCoords] = useState<number[][]>([]);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Use mapRef

  useEffect(() => {
    if (mapRef.current) { // Verifique se mapRef.current está definido
      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: { polygon: true, trash: true },
        defaultMode: 'draw_polygon',
      });

      mapRef.current.addControl(draw.current);

      mapRef.current.on('draw.create', updateArea);
      mapRef.current.on('draw.update', updateArea);
      mapRef.current.on('draw.delete', deleteArea);
    }
  }, []); // Dependência vazia para executar apenas na montagem

  const updateArea = (e: any) => {
    const data = draw.current?.getAll();
    if (data && data.features.length > 0) {
      const coords = data.features[0].geometry.coordinates[0]
        .slice(0, 4)
        .map((coord: number[]) => [coord[1], coord[0]]);
      setPolygonCoords(coords);
    }
  };

  const deleteArea = () => {
    setPolygonCoords([]);
  };

  const enviarPoligono = async () => {
    if (polygonCoords.length === 4) {
      try {
        const response = await fetch('/api/queimadas-na-area', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ coordenadas: polygonCoords }),
        });
        const data = await response.json();
        // exibirDadosFiltrados(data);
      } catch (error) {
        console.error('Erro ao enviar polígono:', error);
      }
    } else {
      alert('Desenhe um polígono de 4 lados para definir a área.');
    }
  };

  // Função para exibir dados filtrados (a implementar)
  const exibirDadosFiltrados = (data: any) => {
    // Lógica para exibir os dados no mapa
  };

  return (
    <BaseMap ref={mapRef}> {/* Use BaseMap */}
      <button onClick={enviarPoligono}>Filtrar por Área</button>
    </BaseMap>
  );
};

export default MapaInterativo;