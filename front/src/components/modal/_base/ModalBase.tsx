import { useEffect } from "react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import {
  ModalOverlay,
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
} from "./modal-styled";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  customWidth?: string;
  customHeight?: string;
  compact?: boolean;
}

export default function ModalBase({
  title,
  onClose,
  children,
  customWidth,
  compact = false,
}: ModalProps) {
  // Impedir o scroll do body quando o modal estiver aberto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    // biome-ignore lint/a11y/useSemanticElements: <explanation>
    <ModalOverlay aria-modal="true" role="dialog">
      <ModalBackdrop onClick={onClose} />
      <ModalContainer customWidth={customWidth}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Fechar">
            <X size={compact ? 16 : 20} color="#FF7300" />
          </CloseButton>
        </ModalHeader>
        <ModalContent
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          $compact={compact}
        >
          {children}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}
