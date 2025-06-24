import { Satellite } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: .3rem;
`;

export const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0rem;
  margin-bottom: 1rem;
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

export const InfoText = styled.p`
  color: #ccc;
  line-height: 1.5;
  margin-bottom: 16px;
`;

export const InfoCard = styled.div`
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #333;
    transform: translateY(-2px);
  }
`;

export const InfoLabel = styled.span`
  color: #fff;
  font-size: 14px;
`;

export const InfoValue = styled.span`
  color: #ff7300;
  font-size: 16px;
  font-weight: 600;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 16px;
  color: #999;
`;

export const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  gap: 16px;
  color: #888;
  text-align: center;
`;

export const DataSourceNote = styled.div`
  font-size: 11px;
  color: #777;
  margin-top: 8px;
  font-style: italic;
`;

export const ChartCard = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.3);
  }
`;

export const ChartTitle = styled.h3`
  color: #f8fafc;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 0.5px;
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 450px;
  position: relative;
  
  @media (max-width: 768px) {
    height: 350px;
  }
`;

export const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 12px;
  }
`;

export const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

export const LegendText = styled.span`
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const LegendValue = styled.span`
  color: #fbbf24;
  font-weight: 600;
  font-size: 12px;
  
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: 24px;
  margin-top: 24px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

export const KpiCard = styled.div`
  background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff7300,rgb(228, 103, 0));
  }
  
  &:hover {
    background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
    transform: translateY(-4px);
    box-shadow: 0 12px 28px -8px rgba(0, 0, 0, 0.4);
  }
`;

export const KpiTitle = styled.div`
  color: #f8fafc;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const KpiValue = styled.div`
  color: #ff7300;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  padding: 8px 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 115, 0, 0.2);
`;

export const KpiDescription = styled.div`
  color: #cbd5e1;
  font-size: 13px;
  line-height: 1.4;
  text-align: center;
  opacity: 0.9;
`;

export const ChartCardLarge = styled(ChartCard)`
  height: auto;
  min-height: 500px;
`;

export const LineChartCard = styled(ChartCard)`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
`;

export const BarChartCard = styled(ChartCard)`
  background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);
`;

export const ScatterChartCard = styled(ChartCard)`
  background:  #374151;
`;

export const ChartIcon = styled.span`
  font-size: 24px;
  margin-right: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

export const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatLabel = styled.div`
  color: #94a3b8;
  font-size: 12px;
  margin-bottom: 4px;
`;

export const StatValue = styled.div`
  color: #f8fafc;
  font-size: 16px;
  font-weight: 600;
`;

export const TooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '12px',
  color: '#f8fafc',
  fontSize: '14px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(8px)'
};

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  min-height: 400px;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
`;

export const PulsingSatelliteIcon = styled(Satellite)`
  animation: ${pulse} 1.2s infinite;
  color: #ff7300;
  width: 64px;
  height: 64px;
  display: block;
  margin: 0 auto;
`;

export const LoadingText = styled.div`
  color: #f8fafc;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
`;

export const LoadingSubtext = styled.div`
  color: #94a3b8;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

export const LoadingCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 20px 0;
  text-align: center;
`;
