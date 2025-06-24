import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ModalContent = styled(motion.div)<{ $compact?: boolean }>`
  background-color: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: ${(props) => (props.$compact ? '400px' : '500px')};
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.2);
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: all 0.2s;
  border-radius: 50%;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

export const ModalBody = styled.div<{ $compact?: boolean }>`
  padding: ${(props) => (props.$compact ? '12px 16px' : '20px')};
  overflow-y: auto;
  max-height: calc(85vh - 60px);
  
  /* Scrollbar customization */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;
