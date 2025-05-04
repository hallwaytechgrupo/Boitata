"use client"

import { useRef, useEffect, useState } from "react"
import { useFilter } from "@/contexts/filter-context"
import Script from "next/script"
import styled from "styled-components"

const FilterPanel = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 0.5rem;
  padding: 0.75rem;
  max-width: 20rem;
  z-index: 10;
  border: 1px solid rgba(75, 85, 99, 0.3);
`

const FilterTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  margin-bottom: 0.25rem;
`

const FilterInfo = styled.p`
  font-size: 0.75rem;
  color: rgb(209, 213, 219);
  line-height: 1.4;
`

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const { region, state, city, biome, dateRange } = useFilter()
  const [mapboxLoaded, setMapboxLoaded] = useState(false)

  useEffect(() => {
    // Esta função será chamada quando o script do Mapbox for carregado
    const initializeMap = () => {
      if (!mapContainer.current || mapLoaded) return

      // @ts-ignore
      if (!window.mapboxgl) {
        console.error("Mapbox GL JS não está disponível")
        return
      }

      try {
        // @ts-ignore
        const mapboxgl = window.mapboxgl
        mapboxgl.accessToken =
          "pk.eyJ1IjoiY2hyaXNmNW0iLCJhIjoiY204ZDRyOWIyMGxuMjJyb3g5a2I5djliZyJ9.M5B_cljHLFcGD_HOC4bJdg"

        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/navigation-night-v1",
          center: [-52.0, -14.0], // Centro aproximado do Brasil
          zoom: 4,
        })

        map.on("load", () => {
          setMapLoaded(true)
          // Expor a instância do mapa globalmente para os modais
          ;(window as any).mapboxMap = map

          // Adicionar camadas e outras configurações aqui
          console.log("Mapa carregado com sucesso!")
        })
      } catch (error) {
        console.error("Erro ao inicializar o mapa:", error)
      }
    }

    if (mapboxLoaded) {
      initializeMap()
    }
  }, [mapLoaded, mapboxLoaded])

  // Verificar se há filtros ativos
  const hasActiveFilters = !!(region || state || city || biome || dateRange.startDate || dateRange.endDate)

  return (
    <>
      <Script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js" onLoad={() => setMapboxLoaded(true)} />
      <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
      <div
        ref={mapContainer}
        className="absolute w-full h-full bg-gray-900"
        style={{ background: "linear-gradient(to bottom, #1a2a3a, #0a1a2a)" }}
      />

      {/* Painel de filtros ativos */}
      {hasActiveFilters && (
        <FilterPanel>
          <FilterTitle>Filtros ativos</FilterTitle>
          <FilterInfo>
            {region ? `Região: ${region}` : ""}
            {state ? `${region ? ", " : ""}Estado: ${state}` : ""}
            {city ? `${region || state ? ", " : ""}Município: ${city}` : ""}
            {biome ? `${region || state || city ? ", " : ""}Bioma: ${biome}` : ""}
            {dateRange.startDate && dateRange.endDate
              ? `${region || state || city || biome ? ", " : ""}Período: ${dateRange.startDate} a ${dateRange.endDate}`
              : ""}
          </FilterInfo>
        </FilterPanel>
      )}
    </>
  )
}
