import { motion } from 'framer-motion';
import styled from 'styled-components';

// Boitata Logo
export const LogoContainer = styled(motion.div)`
  position: fixed;
  top: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  z-index: 20;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(15px);
  /* border: 1px solid rgba(255, 255, 255, 0.1); */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  border-radius: 8px;

  border: 1px solid rgba(255, 115, 0, .3);

`;

export const LogoIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  
  svg {
    filter: drop-shadow(0 0 8px rgba(255, 115, 0, 0.6));
  }
`;

export const LogoText = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

export const MainTitle = styled(motion.h1)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #FF7300;
  line-height: 1.2;
  margin: 0;
`;

export const Subtitle = styled(motion.span)`
  font-size: 0.75rem;
  color: #E5E7EB;
  line-height: 1;
`;
// --

// Filtros Ativos
export const FilterPanel = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 300px;
  z-index: 10;
`;

export const FilterTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: bold;
  color: #FF7300;
  margin-bottom: 4px;
`;

export const FilterInfo = styled.p`
  font-size: 0.75rem;
  color: #E5E7EB;
  line-height: 1.4;
`;

// --

// LayerSelection - Seleção de Camadas
export const LayerContainer = styled.div`
  position: fixed;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const LayerHeader = styled.div`
  background-color: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 0.375rem;
  padding: 0.6rem;
  color: #E5E7EB;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 0.5px solid rgba(255, 115, 0, 0.3);
`;

export const LayerButton = styled.button<{ $isActive: boolean }>`
  background-color: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  padding: 0.6rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 0.5px solid ${(props) => (props.$isActive ? 'rgb(255, 115, 0)' : 'rgba(255, 115, 0, 0.3)')};
  width: 100%;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    transform: scale(1.03);
    border-color: rgb(255, 115, 0);
  }
  
  &:focus {
    outline: none;
  }
`;

export const ButtonIcon = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonLabel = styled.span`
  font-size: 0.7rem;
  color: #E5E7EB;
`;

export const GroupDivider = styled.div`
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0.3rem 0;
  width: 100%;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background-color: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 0.375rem;
  animation: pulse 1.5s infinite ease-in-out;
  
  @keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 0.8; }
    100% { opacity: 0.5; }
  }
`;

export const LoadingText = styled.span`
  font-size: 0.7rem;
  color: #E5E7EB;
`;
// ---
