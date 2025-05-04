"use client"
import styled from "styled-components"
import { BarChart2, Filter, PieChart, Flame, AlertTriangle, MapIcon } from "lucide-react"
import { ModalType } from "../../types"

const NavContainer = styled.div`
  position: fixed;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const NavButton = styled.button<{ $isActive?: boolean }>`
  background-color: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 0.5px solid ${(props) => (props.$isActive ? "rgb(255, 115, 0)" : "rgba(255, 115, 0, 0.3)")};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    transform: scale(1.05);
    border-color: rgb(255, 115, 0);
  }
  
  &:focus {
    outline: none;
  }
`

const ButtonLabel = styled.span`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: none;
  color: #E5E7EB;
  
  @media (min-width: 768px) {
    display: block;
  }
`

const ButtonIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Adicionar um indicador de notificação
const NotificationBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #EF4444;
  z-index: 2;
`

interface SideNavigationProps {
  openModal: (modal: ModalType) => void
  activeLayer: string | null
  onLayerChange: (layer: string) => void
}

export default function SideNavigation({ openModal, activeLayer, onLayerChange }: SideNavigationProps) {
  const handleLayerButtonClick = (layer: string, modal: ModalType) => {
    // Se a camada já está ativa, apenas abra o modal
    if (activeLayer === layer) {
      openModal(modal)
    } else {
      // Caso contrário, ative a camada e abra o modal
      onLayerChange(layer)
      openModal(modal)
    }
  }

  // Simulação de notificações (em um app real, isso viria de um estado ou contexto)
  const hasNotifications = {
    focos: true,
    risco: false,
    area: false,
    graficos: false,
    analises: false,
    filtros: false,
  }

  return (
    <NavContainer>
      <NavButton
        onClick={() => handleLayerButtonClick("focos", ModalType.FOCOS)}
        $isActive={activeLayer === "focos"}
        title="Focos de Calor"
      >
        {hasNotifications.focos && <NotificationBadge />}
        <ButtonIcon>
          <Flame size={24} color="#EF4444" />
        </ButtonIcon>
        <ButtonLabel>Focos de Calor</ButtonLabel>
      </NavButton>

      <NavButton
        onClick={() => handleLayerButtonClick("risco", ModalType.RISCO)}
        $isActive={activeLayer === "risco"}
        title="Risco de Fogo"
      >
        {hasNotifications.risco && <NotificationBadge />}
        <ButtonIcon>
          <AlertTriangle size={24} color="#FACC15" />
        </ButtonIcon>
        <ButtonLabel>Risco de Fogo</ButtonLabel>
      </NavButton>

      <NavButton
        onClick={() => handleLayerButtonClick("area", ModalType.AREA)}
        $isActive={activeLayer === "area"}
        title="Área Queimada"
      >
        {hasNotifications.area && <NotificationBadge />}
        <ButtonIcon>
          <MapIcon size={24} color="#15803D" />
        </ButtonIcon>
        <ButtonLabel>Área Queimada</ButtonLabel>
      </NavButton>

      <NavButton onClick={() => openModal(ModalType.GRAFICOS)} title="Gráficos">
        {hasNotifications.graficos && <NotificationBadge />}
        <ButtonIcon>
          <BarChart2 size={24} color="#FACC15" />
        </ButtonIcon>
        <ButtonLabel>Gráficos</ButtonLabel>
      </NavButton>

      <NavButton onClick={() => openModal(ModalType.ANALISES)} title="Análises">
        {hasNotifications.analises && <NotificationBadge />}
        <ButtonIcon>
          <PieChart size={24} color="#E5E7EB" />
        </ButtonIcon>
        <ButtonLabel>Análises</ButtonLabel>
      </NavButton>

      <NavButton onClick={() => openModal(ModalType.FILTROS)} title="Filtros">
        {hasNotifications.filtros && <NotificationBadge />}
        <ButtonIcon>
          <Filter size={24} color="#E5E7EB" />
        </ButtonIcon>
        <ButtonLabel>Filtros</ButtonLabel>
      </NavButton>
    </NavContainer>
  )
}
