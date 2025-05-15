import styled from "styled-components";

interface ModalContainerProps {
  customWidth?: string;
  $customHeight?: string;
}

export const ModalOverlay = styled.div`
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
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  transition: opacity 0.3s;
`;

export const ModalContainer = styled.div<ModalContainerProps>`
  position: relative;
  background-color: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(8px);
  // border: 1px solid rgba(75, 85, 99, 0.3);
  border: 0.5px solid rgb(255, 115, 0, 0.3);
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: ${(props) => props.customWidth || "32rem"};
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  transform: scale(1);
  transition: transform 0.3s;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  // border-bottom: 1px solid rgba(75, 85, 99, 0.5);
  border-bottom: 0.5px solid rgb(255, 115, 0, 0.3);
`;

export const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: white;
`;

export const CloseButton = styled.button`
  color: rgba(156, 163, 175, 0.8);
  transition: color 0.2s;

  &:hover {
    color: white;
  }

  &:focus {
    outline: none;
  }
`;

export const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto; /* Enable vertical scrolling */
  color: rgb(209, 213, 219);
  max-height: calc(90vh - 4rem); /* Altura máxima ajustada para o conteúdo (subtraindo o header) */
  
  /* Estilização da barra de rolagem */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(55, 65, 81, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 115, 0, 0.5); /* Cor laranja do tema */
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 115, 0, 0.7);
  }
  
  /* Espaçamento para dispositivos móveis */
  @media (max-width: 640px) {
    padding: 1rem;
    max-height: calc(95vh - 3.5rem);
  }
`;
