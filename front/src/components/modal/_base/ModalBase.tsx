import { useEffect } from "react"
import { X } from "lucide-react"
import type { ReactNode } from "react"
import { ModalOverlay, ModalBackdrop, ModalContainer, ModalHeader, ModalTitle, CloseButton, ModalContent } from './modal-styled'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

export default function ModalBase({ title, onClose, children }: ModalProps) {
  // Impedir o scroll do body quando o modal estiver aberto
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    // biome-ignore lint/a11y/useSemanticElements: <explanation>
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
