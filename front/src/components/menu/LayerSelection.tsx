import { useState } from "react"
import styled from "styled-components"
import { Layers, MapIcon, Flame } from "lucide-react"

const LayersContainer = styled.div`
  position: fixed;
  right: 4rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const LayerButton = styled.button<{ $isActive: boolean }>`
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  color: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${(props) => (props.$isActive ? "rgb(255, 115, 0)" : "rgb(255, 115, 0, 0.3)")};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    transform: scale(1.05);
    border-color: rgb(255, 115, 0);
  }
  
  &:focus {
    outline: none;
  }
`

const LayerLabel = styled.span`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
`

const LayerIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface LayersNavigationProps {
  onLayerChange: (layer: string) => void
}

export default function LayersNavigation({ onLayerChange }: LayersNavigationProps) {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)

  const toggleLayer = (layer: string) => {
    // Se a camada já está ativa, desative-a
    if (activeLayer === layer) {
      setActiveLayer(null)
      onLayerChange("none")
    } else {
      // Caso contrário, ative a nova camada
      setActiveLayer(layer)
      onLayerChange(layer)
    }
  }

  return (
    <LayersContainer>
      <LayerButton onClick={() => toggleLayer("focos")} $isActive={activeLayer === "focos"} title="Focos de Calor">
        <LayerIcon>
          <Flame size={24} />
        </LayerIcon>
        <LayerLabel>Focos</LayerLabel>
      </LayerButton>

      <LayerButton onClick={() => toggleLayer("risco")} $isActive={activeLayer === "risco"} title="Risco de Fogo">
        <LayerIcon>
          <Layers size={24} />
        </LayerIcon>
        <LayerLabel>Risco</LayerLabel>
      </LayerButton>

      <LayerButton onClick={() => toggleLayer("area")} $isActive={activeLayer === "area"} title="Área Queimada">
        <LayerIcon>
          <MapIcon size={24} />
        </LayerIcon>
        <LayerLabel>Área</LayerLabel>
      </LayerButton>
    </LayersContainer>
  )
}
