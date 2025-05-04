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

const StatsContainer = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`

const StatsTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.75rem;
`

const StatsValue = styled.div`
  text-align: center;
`

const StatsNumber = styled.span`
  font-size: 1.875rem;
  font-weight: 700;
  color: rgb(239, 68, 68);
`

const StatsUnit = styled.span`
  font-size: 0.875rem;
  color: rgb(209, 213, 219);
  margin-left: 0.5rem;
`

const StatsPeriod = styled.div`
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: rgb(156, 163, 175);
  text-align: center;
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

interface AreaQueimadaModalProps {
  onClose: () => void
}

export default function AreaQueimadaModal({ onClose }: AreaQueimadaModalProps) {
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
