import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
`;

export const ChartContainer = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 1rem;
  height: 250px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  background-color: rgba(55, 65, 81, 0.8);
  color: white;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  border: none;
  transition: background-color 0.2s;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(75, 85, 99, 0.8);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
  }
  
  svg {
    width: 0.75rem;
    height: 0.75rem;
    margin-right: 0.25rem;
  }
`;
