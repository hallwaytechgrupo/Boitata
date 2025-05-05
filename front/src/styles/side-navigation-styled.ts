import styled from 'styled-components';

export const NavContainer = styled.div`
  position: fixed;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const NavButton = styled.button<{ $isActive?: boolean }>`
  background-color: rgba(17, 24, 39, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  padding: 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 0.5px solid ${(props) => (props.$isActive ? 'rgb(255, 115, 0)' : 'rgba(255, 115, 0, 0.3)')};
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
    transform: scale(1.05);
    border-color: rgb(255, 115, 0);
  }
  
  &:focus {
    outline: none;
  }
`;

export const ButtonLabel = styled.span`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: none;
  color: #E5E7EB;
  
  @media (min-width: 768px) {
    display: block;
  }
`;

export const ButtonIcon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
