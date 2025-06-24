import styled from 'styled-components';

export const FilterInfo = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const FilterTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.5rem;
`;

export const FilterText = styled.div`
  font-size: 0.75rem;
  color: rgb(156, 163, 175);
`;

export const ResultsContainer = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 1rem;
`;

export const ResultsTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.5rem;
`;

export const TableContainer = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  min-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

export const TableHead = styled.thead`
  border-bottom: 1px solid rgba(75, 85, 99, 0.5);
`;

export const TableHeader = styled.th`
  padding: 0.5rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(156, 163, 175);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TableBody = styled.tbody`
  & > tr:not(:last-child) {
    border-bottom: 1px solid rgba(75, 85, 99, 0.3);
  }
`;

export const TableCell = styled.td`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: rgb(209, 213, 219);
`;

export const QuantityCell = styled(TableCell)`
  color: rgb(239, 68, 68);
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
`;

export const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid rgba(22, 163, 74, 0.3);
  border-top-color: rgb(22, 163, 74);
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

export const ApplyButton = styled.button`
  background-color: rgba(22, 163, 74, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(22, 163, 74, 0.9);
  }
  
  &:focus {
    outline: none;
  }
`;
