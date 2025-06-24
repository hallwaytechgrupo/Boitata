import styled from 'styled-components'

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.5rem;
`

export const Select = styled.select`
  width: 100%;
  background-color: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.8);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  color: white;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.5);
  }
`

export const LegendContainer = styled.div`
  background-color: rgba(31, 41, 55, 0.8);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`

export const LegendTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209, 213, 219);
  margin-bottom: 0.75rem;
`

export const LegendItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
`

export const LegendColor = styled.div<{ $color: string }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  background-color: ${(props) => props.$color};
  margin-right: 0.5rem;
`

export const LegendText = styled.span`
  font-size: 0.875rem;
  color: rgb(209, 213, 219);
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

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
`