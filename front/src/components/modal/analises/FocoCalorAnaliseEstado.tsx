import { Section, SectionTitle, InfoText, InfoCard, InfoLabel, InfoValue } from './analises-styled';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface FocoCalorAnaliseEstadoProps {
  data: any;
  patternLabel: string;
}

export default function FocoCalorAnaliseEstado({ data, patternLabel }: FocoCalorAnaliseEstadoProps) {
  const formatNumero = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatarData = (dataIso: string) => {
    if (!dataIso) return "N/A";
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR');
  };

  return (
    <Section>
      <SectionTitle>Estatísticas do Estado: {data.estado}</SectionTitle>
      <InfoText>Análise: {patternLabel}</InfoText>
      
      <InfoCard>
        <InfoLabel>Última atualização:</InfoLabel>
        <InfoValue>{formatarData(data.ultima_atualizacao)}</InfoValue>
      </InfoCard>

      {data.maior_frp && (
        <InfoCard>
          <InfoLabel>Maior poder radiativo (FRP):</InfoLabel>
          <InfoValue>
            {data.maior_frp.frp.toFixed(2)} MW em {data.maior_frp.municipio} ({formatarData(data.maior_frp.data)})
          </InfoValue>
        </InfoCard>
      )}

      {data.top_cidades && data.top_cidades.length > 0 && (
        <>
          <SectionTitle>Municípios com Maior Incidência</SectionTitle>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <BarChart data={data.top_cidades}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="municipio" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatNumero(Number(value)), 'Focos de Calor']}
                />
                <Bar dataKey="total_focos" fill="#FF6B6B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Section>
  );
}
