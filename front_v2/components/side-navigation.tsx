"use client"
import styled from "styled-components"
import { Map, BarChart2, Filter, PieChart } from "lucide-react"
import type { ModalType } from "@/types"

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

const NavButton = styled.button`
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  color: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid transparent;
  
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

interface SideNavigationProps {
  openModal: (modal: ModalType) => void
}

export default function SideNavigation({ openModal }: SideNavigationProps) {
  return (
    <NavContainer>
      <NavButton onClick={() => openModal("area")} title="Estatísticas">
        <ButtonIcon>
          <Map size={24} />
        </ButtonIcon>
        <ButtonLabel>Estatísticas</ButtonLabel>
      </NavButton>

      <NavButton onClick={() => openModal("graficos")} title="Gráficos">
        <ButtonIcon>
          <BarChart2 size={24} />
        </ButtonIcon>
        <ButtonLabel>Gráficos</ButtonLabel>
      </NavButton>

      <NavButton onClick={() => openModal("analises")} title="Análises">
        <ButtonIcon>
          <PieChart size={24} />
        </ButtonIcon>
        <ButtonLabel>Análises</ButtonLabel>
      </NavButton>

      <NavButton onClick={() => openModal("filtros")} title="Filtros">
        <ButtonIcon>
          <Filter size={24} />
        </ButtonIcon>
        <ButtonLabel>Filtros</ButtonLabel>
      </NavButton>
    </NavContainer>
  )
}
