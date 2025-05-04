"use client"

import { useState } from "react"
import styled from "styled-components"
import Modal from "@/components/modal"

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.5rem;
`

const Select = styled.select`
  width: 100%;
  background-color: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.8);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  color: white;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.5);
  }
`

const LegendContainer = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`

const LegendTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.75rem;
`

const LegendItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
`

const LegendColor = styled.div<{ $color: string }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  background-color: ${(props) => props.$color};
  margin-right: 0.5rem;
`

const LegendText = styled.span`
  font-size: 0.875rem;
  color: rgb(209, 213, 219);
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ApplyButton = styled.button`
  background-color: rgba(22, 163, 74, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(22, 163, 74, 0.9);
  }
  
  &:focus {
    outline: none;
  }
`

interface RiscoModalProps {
  onClose: () => void
}

export default function RiscoModal({ onClose }: RiscoModalProps) {
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
