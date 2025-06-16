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

interface FocoCalorAnaliseBiomaProps {
  data: any;
  patternLabel: string;
}

export default function FocoCalorAnaliseBioma({ data, patternLabel }: FocoCalorAnaliseBiomaProps) {
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
      <SectionTitle>Estatísticas do Bioma: {data.nome}</SectionTitle>
      <InfoText>Análise: {patternLabel}</InfoText>
      
      {/* Métricas principais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <InfoCard>
          <InfoLabel>Extensão territorial:</InfoLabel>
          <InfoValue>{formatNumero(Math.round(data.area_km2 || 0))} km²</InfoValue>
        </InfoCard>
        
        <InfoCard>
          <InfoLabel>Focos detectados (30 dias):</InfoLabel>
          <InfoValue>{formatNumero(data.total_focos_30dias || 0)}</InfoValue>
        </InfoCard>
        
        <InfoCard>
          <InfoLabel>Density de focos:</InfoLabel>
          <InfoValue>{data.densidade_focos_por_km2?.toFixed(4) || 0} por km²</InfoValue>
        </InfoCard>
      </div>

      {/* Comparação de focos */}
      <SectionTitle>Análise Comparativa</SectionTitle>
      <div style={{ width: '100%', height: '300px', marginBottom: '2rem' }}>
        <ResponsiveContainer>
          <BarChart data={[
            { 
              periodo: 'Período Recente', 
              focos: data.total_focos_30dias || 0 
            },
            { 
              periodo: 'Registro Histórico', 
              focos: data.total_focos_historico || 0 
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip formatter={(value) => [formatNumero(Number(value)), 'Focos de Calor']} />
            <Bar dataKey="focos" fill="#FFEAA7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Municípios com maior incidência */}
      {data.top_municipios_afetados && data.top_municipios_afetados.length > 0 && (
        <>
          <SectionTitle>Municípios com Maior Incidência</SectionTitle>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <BarChart data={data.top_municipios_afetados}>
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
                  labelFormatter={(label, payload) => {
                    const data = payload?.[0]?.payload;
                    return data ? `${data.municipio} - ${data.estado}` : label;
                  }}
                />
                <Bar dataKey="total_focos" fill="#DDA0DD" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <InfoCard>
        <InfoLabel>Última atualização:</InfoLabel>
        <InfoValue>{formatarData(data.ultima_atualizacao)}</InfoValue>
      </InfoCard>
    </Section>
  );
}
