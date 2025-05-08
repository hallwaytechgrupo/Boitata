import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FilterLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #d1d5db;
`;

export const FilterSelect = styled.select`
  width: 100%;
  background-color: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.8);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  color: white;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
  }
`;

export const ChartContainer = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 1rem;
  height: 300px;
`;

export const ChartTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: #d1d5db;
  margin-bottom: 0.75rem;
  text-align: center;
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
  padding: 0.5rem 1rem;
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
    outline-offset: 2px;
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
  }
`;
