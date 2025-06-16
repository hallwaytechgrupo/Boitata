import { Section, SectionTitle, InfoText, InfoCard, InfoLabel, InfoValue } from './analises-styled';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface FocoCalorAnaliseMunicipioProps {
  data: any;
  patternLabel: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

export default function FocoCalorAnaliseMunicipio({ data, patternLabel }: FocoCalorAnaliseMunicipioProps) {
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
      <SectionTitle>Estatísticas do Município: {data.municipio} - {data.estado}</SectionTitle>
      <InfoText>Análise: {patternLabel}</InfoText>
      
      {/* Métricas principais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <InfoCard>
          <InfoLabel>Focos detectados (30 dias):</InfoLabel>
          <InfoValue>{formatNumero(Number(data.total_focos_30dias) || 0)}</InfoValue>
        </InfoCard>
        
        <InfoCard>
          <InfoLabel>Índice médio de risco:</InfoLabel>
          <InfoValue>{(Number.parseFloat(data.risco_fogo_medio) * 100).toFixed(2)}%</InfoValue>
        </InfoCard>
        
        <InfoCard>
          <InfoLabel>Potência radiativa média:</InfoLabel>
          <InfoValue>{Number.parseFloat(data.frp_medio).toFixed(2)} MW</InfoValue>
        </InfoCard>
      </div>

      {/* Gráfico de comparação de riscos */}
      <SectionTitle>Análise de Índices de Risco</SectionTitle>
      <div style={{ width: '100%', height: '300px', marginBottom: '2rem' }}>
        <ResponsiveContainer>
          <BarChart data={[
            { 
              tipo: 'Índice Médio', 
              valor: Number.parseFloat(data.risco_fogo_medio) * 100 
            },
            { 
              tipo: 'Índice Máximo', 
              valor: Number.parseFloat(data.risco_fogo_maximo) * 100 
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Índice de Risco']} />
            <Bar dataKey="valor" fill="#4ECDC4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de poder radiativo */}
      <SectionTitle>Potência Radiativa (FRP)</SectionTitle>
      <div style={{ width: '100%', height: '300px', marginBottom: '2rem' }}>
        <ResponsiveContainer>
          <BarChart data={[
            { 
              tipo: 'Potência Média', 
              valor: Number.parseFloat(data.frp_medio) 
            },
            { 
              tipo: 'Potência Máxima', 
              valor: Number.parseFloat(data.frp_maximo) 
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} MW`, 'Potência Radiativa']} />
            <Bar dataKey="valor" fill="#45B7D1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detecção por satélites */}
      {(() => {
        let satelitesData = [];
        try {
          satelitesData = typeof data.deteccao_satelites === 'string' 
            ? JSON.parse(data.deteccao_satelites)
            : data.deteccao_satelites || [];
        } catch (error) {
          console.error("Erro ao parsear dados dos satélites:", error);
          satelitesData = [];
        }

        return satelitesData && satelitesData.length > 0 ? (
          <>
            <SectionTitle>Distribuição por Satélite</SectionTitle>
            <div style={{ width: '100%', height: '400px', marginBottom: '2rem' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={satelitesData.map((sat: any) => ({
                      name: `${sat.satelite}`,
                      value: Number(sat.total_focos) || 0
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {satelitesData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatNumero(Number(value)), 'Detecções']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : null;
      })()}

      {/* Série histórica */}
      {(() => {
        let serieData = [];
        try {
          serieData = typeof data.serie_historica === 'string' 
            ? JSON.parse(data.serie_historica)
            : data.serie_historica || [];
        } catch (error) {
          console.error("Erro ao parsear série histórica:", error);
          serieData = [];
        }

        return serieData && serieData.length > 0 ? (
          <>
            <SectionTitle>Evolução Temporal</SectionTitle>
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer>
                <AreaChart data={serieData.map((item: any) => ({
                  mes: item.mes,
                  total: Number(item.total) || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatNumero(Number(value)), 'Focos de Calor']} />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#96CEB4" 
                    fill="#96CEB4" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : null;
      })()}

      <InfoCard>
        <InfoLabel>Última atualização:</InfoLabel>
        <InfoValue>{formatarData(data.ultima_atualizacao)}</InfoValue>
      </InfoCard>
    </Section>
  );
}
