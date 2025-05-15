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

export const TabsContainer = styled(motion.div)`
  display: flex;
  border-bottom: 1px solid rgba(75, 85, 99, 0.5);
  margin-bottom: 1.5rem;
`;

export const Tab = styled(motion.button)<{ $isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: ${(props) => (props.$isActive ? '600' : '400')};
  color: ${(props) => (props.$isActive ? 'white' : 'rgba(209, 213, 219, 0.8)')};
  border-bottom: 2px solid ${(props) => (props.$isActive ? '#FF7300' : 'transparent')};
  background-color: transparent;
  border-left: none;
  border-right: none;
  border-top: none;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    color: white;
  }
  
  &:focus {
    outline: none;
  }
`;

export const FilterContainer = styled(motion.div)`
  margin-bottom: 1.5rem;
`;

export const FilterLabel = styled(motion.label)`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #FF7300;
  margin-bottom: 0.5rem;
`;

export const FilterSelect = styled(motion.select)`
  width: 100%;
  background: rgba(31, 41, 55, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  color: white;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 115, 0, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
  }
`;

export const FilterInput = styled.input<{ disabled?: boolean }>`
  box-sizing: border-box;
  width: 100%;
  background: rgba(31, 41, 55, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  color: white;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 115, 0, 0.5);
  }
`;

export const FilterGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const ActiveFiltersContainer = styled(motion.div)`
  background: rgba(31, 41, 55, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const ActiveFiltersTitle = styled(motion.h4)`
  font-size: 0.875rem;
  font-weight: 500;
  color: #FF7300;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
`;

export const ActiveFiltersList = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const ActiveFilterTag = styled(motion.div)`
  background: rgba(55, 65, 81, 0.8);
  color: #E5E7EB;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
`;

export const RemoveFilterButton = styled(motion.button)`
  margin-left: 0.25rem;
  color: rgba(156, 163, 175, 0.8);
  background: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
  
  &:focus {
    outline: none;
  }
`;

export const ButtonsContainer = styled(motion.div)`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const ResetButton = styled(Button)`
  background: rgba(75, 85, 99, 0.8);
  color: white;
  
  &:hover {
    background: rgba(55, 65, 81, 0.8);
  }
`;

export const ApplyButton = styled(Button)`
  background: #FF7300;
  color: white;
  
  &:hover {
    background:rgb(207, 93, 0);
  }

  &:disabled {
    background: #FFA366;
    color: #F3F4F6;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
