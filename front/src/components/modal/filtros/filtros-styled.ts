import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 12px;
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: 8px;
  padding: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Tab = styled(motion.button)<{ $isActive: boolean }>`
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.$isActive ? 'rgba(255, 115, 0, 0.9)' : 'transparent')};
  color: ${(props) => (props.$isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)')};
  
  &:hover {
    color: #fff;
  }
`;

export const FilterContainer = styled(motion.div)`
  margin-bottom: 10px;
`;

export const FilterLabel = styled.label`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
`;

export const FilterSelect = styled.select`
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(100, 100, 100, 0.3);
  background-color: rgba(40, 40, 40, 0.7);
  color: #fff;
  font-size: 13px;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 115, 0, 0.6);
    box-shadow: 0 0 0 2px rgba(255, 115, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  option {
    background-color: #333;
  }
`;

export const FilterInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid rgba(100, 100, 100, 0.3);
  background-color: rgba(40, 40, 40, 0.7);
  color: #fff;
  font-size: 13px;
  transition: all 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 115, 0, 0.6);
    box-shadow: 0 0 0 2px rgba(255, 115, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.7;
  }
`;

export const FilterGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-bottom: 10px;
`;

export const ActiveFiltersContainer = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.6);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid rgba(255, 115, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ActiveFiltersTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ActiveFiltersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const ActiveFilterTag = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: rgba(255, 115, 0, 0.15);
  border: 1px solid rgba(255, 115, 0, 0.3);
  border-radius: 16px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
`;

export const RemoveFilterButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 1px;
`;

export const ButtonsContainer = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 16px;
`;

export const ResetButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(70, 70, 70, 0.3);
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: rgba(70, 70, 70, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ApplyButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background-color: rgba(255, 115, 0, 0.9);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(255, 115, 0, 0.3);
  
  &:hover:not(:disabled) {
    background-color: rgba(255, 115, 0, 1);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(255, 115, 0, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(255, 115, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Section = styled(motion.div)`
  background-color: rgba(40, 40, 40, 0.4);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid rgba(100, 100, 100, 0.2);
`;

export const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  gap: 4px;
`;
