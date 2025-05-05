import { useState } from "react"
import Modal from '../_base/ModalBase'
import { ApplyButton, ButtonContainer, FormGroup, Label, Select, StatsContainer, StatsNumber, StatsPeriod, StatsTitle, StatsUnit, StatsValue } from './area-queimada-styled'

interface AreaQueimadaModalProps {
  onClose: () => void
}

export default function ModalAreaQueimada({ onClose }: AreaQueimadaModalProps) {
  const [selectedRegion, setSelectedRegion] = useState("")

  const handleApply = () => {
    // Simular a visualização no mapa
    console.log("Aplicando visualização de área queimada para região:", selectedRegion)
    onClose()
  }

  return (
    <Modal title="Área Queimada" onClose={onClose}>
      <FormGroup>
        <Label htmlFor="region-select">Selecione a região</Label>
        <Select id="region-select" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
          <option value="">Selecione...</option>
          <option value="brasil">Brasil</option>
          <option value="amazonia">Amazônia</option>
          <option value="cerrado">Cerrado</option>
          <option value="pantanal">Pantanal</option>
          <option value="caatinga">Caatinga</option>
          <option value="mata-atlantica">Mata Atlântica</option>
          <option value="pampa">Pampa</option>
        </Select>
      </FormGroup>

      <StatsContainer>
        <StatsTitle>Total de Área Queimada</StatsTitle>
        <StatsValue>
          <StatsNumber>12,345</StatsNumber>
          <StatsUnit>km²</StatsUnit>
        </StatsValue>
        <StatsPeriod>Período: 01/01/2023 - 01/04/2023</StatsPeriod>
      </StatsContainer>

      <ButtonContainer>
        <ApplyButton onClick={handleApply}>Visualizar no Mapa</ApplyButton>
      </ButtonContainer>
    </Modal>
  )
}
