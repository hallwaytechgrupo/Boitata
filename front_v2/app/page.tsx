"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import styled from "styled-components"
import SideNavigation from "@/components/side-navigation"
import LayersNavigation from "@/components/layers-navigation"
import FocosModal from "@/components/modals/focos-modal"
import RiscoModal from "@/components/modals/risco-modal"
import AreaQueimadaModal from "@/components/modals/area-queimada-modal"
import GraficosModal from "@/components/modals/graficos-modal"
import FiltrosModal from "@/components/modals/filtros-modal"
import AnalisesModal from "@/components/modals/analises-modal"
import { FilterProvider } from "@/contexts/filter-context"
import type { ModalType } from "@/types"
import Image from "next/image"

const LogoContainer = styled.div`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  padding: 0.75rem;
  border-radius: 0.375rem;
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`

const LogoText = styled.span`
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
`

const SubtitleText = styled.div`
  color: rgb(209, 213, 219);
  font-size: 0.875rem;
`

const LoadingContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(17, 24, 39);
`

const LoadingText = styled.div`
  color: white;
  font-size: 1.25rem;
`

// Importação dinâmica do mapa para evitar problemas de SSR com o Mapbox
const MapComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <LoadingContainer>
      <LoadingText>Carregando mapa...</LoadingText>
    </LoadingContainer>
  ),
})

export default function Home() {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null)
  const [activeLayer, setActiveLayer] = useState<string | null>(null)

  const openModal = (modal: ModalType) => {
    setActiveModal(modal)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  const handleLayerChange = (layer: string) => {
    setActiveLayer(layer)
  }

  return (
    <FilterProvider>
      <main className="relative w-full h-screen overflow-hidden">
        {/* Mapa como fundo em tela cheia */}
        <MapComponent />

        {/* Logo e título no canto superior esquerdo */}
        <LogoContainer>
          <LogoWrapper>
            <Image
              src="https://github.com/hallwaytechgrupo/Boitata/raw/main/Planejamento/utils/boitataLogoT.png"
              alt="Boitata INPE logo"
              width={60}
              height={60}
              className="mr-2"
            />
            <LogoText>Boitata</LogoText>
          </LogoWrapper>
          <SubtitleText>Programa Queimadas</SubtitleText>
        </LogoContainer>

        {/* Botões de navegação na lateral esquerda */}
        <SideNavigation openModal={openModal} />

        {/* Botões de camadas na lateral direita */}
        <LayersNavigation onLayerChange={handleLayerChange} />

        {/* Modais */}
        {activeModal === "focos" && <FocosModal onClose={closeModal} />}
        {activeModal === "risco" && <RiscoModal onClose={closeModal} />}
        {activeModal === "area" && <AreaQueimadaModal onClose={closeModal} />}
        {activeModal === "graficos" && <GraficosModal onClose={closeModal} />}
        {activeModal === "filtros" && <FiltrosModal onClose={closeModal} />}
        {activeModal === "analises" && <AnalisesModal onClose={closeModal} />}
      </main>
    </FilterProvider>
  )
}
