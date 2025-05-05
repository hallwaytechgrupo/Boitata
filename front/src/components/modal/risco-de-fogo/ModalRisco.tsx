import { useState } from "react"
import Modal from '../_base/ModalBase'
import { FormGroup, Label, Select, LegendContainer, LegendTitle, LegendItems, LegendItem, LegendColor, LegendText, ButtonContainer, ApplyButton } from './risco-styled'

interface RiscoModalProps {
  onClose: () => void
}

export default function ModalRisco({ onClose }: RiscoModalProps) {
  const [selectedRegion, setSelectedRegion] = useState("")

  const handleApply = () => {
    // Simular a visualização no mapa
    console.log("Aplicando visualização de risco para região:", selectedRegion)
    onClose()
  }

  return (
    <Modal title="Risco de Fogo" onClose={onClose}>
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

      <LegendContainer>
        <LegendTitle>Legenda de Risco</LegendTitle>
        <LegendItems>
          <LegendItem>
            <LegendColor $color="#4ade80" />
            <LegendText>Baixo</LegendText>
          </LegendItem>
          <LegendItem>
            <LegendColor $color="#eab308" />
            <LegendText>Médio</LegendText>
          </LegendItem>
          <LegendItem>
            <LegendColor $color="#f97316" />
            <LegendText>Alto</LegendText>
          </LegendItem>
          <LegendItem>
            <LegendColor $color="#dc2626" />
            <LegendText>Crítico</LegendText>
          </LegendItem>
        </LegendItems>
      </LegendContainer>

      <ButtonContainer>
        <ApplyButton onClick={handleApply}>Aplicar</ApplyButton>
      </ButtonContainer>
    </Modal>
  )
}
