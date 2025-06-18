import { BarChart2, Filter, PieChart, Flame, AlertTriangle, MapIcon } from "lucide-react"
import { ModalType } from "../../types"
import { NavContainer, NavButton, ButtonLabel, ButtonIcon } from '../../styles/side-navigation-styled';

interface SideNavigationProps {
  openModal: (modal: ModalType) => void;
  activeLayer: string | null;
  onLayerChange?: (layer: string) => void;
}

export default function SideNavigation({ openModal, activeLayer }: SideNavigationProps) {
  const handleLayerButtonClick = (layer: string, modal: ModalType) => {
    // Para debug
    console.log("Clicou no botão:", layer, modal);
console.log(activeLayer, "- camada ativa")    // Para debug
    
    // Se a camada já está ativa, apenas abra o modal
    if (activeLayer === layer) {
      openModal(modal);
    } else {
      console.log("Entrando no else")
      // Caso contrário, ative a camada e abra o modal
      // onLayerChange(layer);
      openModal(modal);
    }
  }

  return (
    <NavContainer>
      <NavButton 
        onClick={() => {
          console.log("Clicou no botão Filtros");
          openModal(ModalType.FILTROS);
        }} 
        title="Filtros"
      >
          <Filter size={24} color="#E5E7EB" />
        <ButtonLabel>Filtros</ButtonLabel>
      </NavButton>

      {/* <NavButton
        onClick={() => handleLayerButtonClick("focos", ModalType.FOCOS)}
        $isActive={activeLayer === "focos"}
        title="Focos de Calor"
      >
        <ButtonIcon>
          <Flame size={24} color="#E5E7EB" />
        </ButtonIcon>
        <ButtonLabel>Focos de Calor</ButtonLabel>
      </NavButton>

      <NavButton
        onClick={() => handleLayerButtonClick("risco", ModalType.RISCO)}
        $isActive={activeLayer === "risco"}
        title="Risco de Fogo"
      >
        <ButtonIcon>
          <AlertTriangle size={24} color="#E5E7EB" />
        </ButtonIcon>
        <ButtonLabel>Risco de Fogo</ButtonLabel>
      </NavButton>

      <NavButton
        onClick={() => handleLayerButtonClick("area", ModalType.AREA)}
        $isActive={activeLayer === "area"}
        title="Área Queimada"
      >
        <ButtonIcon>
          <MapIcon size={24} color="#E5E7EB" />
        </ButtonIcon>
        <ButtonLabel>Área Queimada</ButtonLabel>
      </NavButton> */}

      <NavButton onClick={() => openModal(ModalType.GRAFICOS)} title="Gráficos">
        <ButtonIcon>
          <BarChart2 size={24} color="#E5E7EB" />
        </ButtonIcon>
        <ButtonLabel>Gráficos</ButtonLabel>
      </NavButton>

      <NavButton onClick={() => openModal(ModalType.ANALISES)} title="Análises">
        <ButtonIcon>
          <PieChart size={24} color="#E5E7EB" />
        </ButtonIcon>
        <ButtonLabel>Análises</ButtonLabel>
      </NavButton>
    </NavContainer>
  )
}
