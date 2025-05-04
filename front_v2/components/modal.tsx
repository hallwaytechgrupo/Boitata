"use client"
import { useEffect } from "react"
import styled from "styled-components"
import { X } from "lucide-react"
import type { ReactNode } from "react"

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  
  @media (min-width: 640px) {
    padding: 0;
  }
`

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  transition: opacity 0.3s;
`

const ModalContainer = styled.div`
  position: relative;
  background-color: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 32rem;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  transform: scale(1);
  transition: transform 0.3s;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgba(75, 85, 99, 0.5);
`

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: white;
`

const CloseButton = styled.button`
  color: rgba(156, 163, 175, 0.8);
  transition: color 0.2s;
  
  &:hover {
    color: white;
  }
  
  &:focus {
    outline: none;
  }
`

const ModalContent = styled.div`
  padding: 1.5rem;
  color: rgb(209, 213, 219);
`

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({ title, onClose, children }: ModalProps) {
  // Impedir o scroll do body quando o modal estiver aberto
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <ModalOverlay aria-modal="true" role="dialog">
      <ModalBackdrop onClick={onClose} />
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Fechar">
            <X size={24} />
          </CloseButton>
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </ModalOverlay>
  )
}
