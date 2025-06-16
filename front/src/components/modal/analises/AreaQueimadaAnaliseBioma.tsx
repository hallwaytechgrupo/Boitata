import { Section, SectionTitle, InfoText, InfoCard, InfoLabel, InfoValue } from './analises-styled';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface AreaQueimadaAnaliseBiomaProps {
  data: any;
  patternLabel: string;
}

export default function AreaQueimadaAnaliseBioma({ data, patternLabel }: AreaQueimadaAnaliseBiomaProps) {
  const formatNumero = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatarData = (dataIso: string) => {
    if (!dataIso) return "N/A";
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR');
  };

  const formatArea = (area: number) => {
    return `${formatNumero(Math.round(area))} km²`;
  };

  return (
    <Section>
      <SectionTitle>Estatísticas do Bioma: {data.nome}</SectionTitle>
      <InfoText>Análise: {patternLabel}</InfoText>
      
      {/* Métricas principais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <InfoCard>
          <InfoLabel>Extensão territorial:</InfoLabel>
          <InfoValue>{formatArea(data.area_total_km2 || 0)}</InfoValue>
        </InfoCard>
        
        <InfoCard>
          <InfoLabel>Área queimada total:</InfoLabel>
          <InfoValue>{formatArea(data.area_queimada_total_km2 || 0)}</InfoValue>
        </InfoCard>
        
        <InfoCard>
          <InfoLabel>% do bioma afetado:</InfoLabel>
          <InfoValue style={{ color: '#e74c3c' }}>
            {data.percentual_afetado ? `${data.percentual_afetado.toFixed(2)}%` : 'N/A'}
          </InfoValue>
        </InfoCard>
        
        <InfoCard>
          <InfoLabel>Área queimada (mês atual):</InfoLabel>
          <InfoValue>{formatArea(data.area_queimada_mes_atual_km2 || 0)}</InfoValue>
        </InfoCard>
      </div>

      {/* Evolução temporal */}
      {data.evolucao_temporal && data.evolucao_temporal.length > 0 && (
        <>
          <SectionTitle>Evolução Temporal da Área Queimada</SectionTitle>
          <div style={{ width: '100%', height: '300px', marginBottom: '2rem' }}>
            <ResponsiveContainer>
              <LineChart data={data.evolucao_temporal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mes"
                  tickFormatter={(value) => {
                    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                                   'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                    return meses[value - 1] || value;
                  }}
                />
                <YAxis tickFormatter={(value) => formatArea(value)} />
                <Tooltip 
                  formatter={(value) => [formatArea(Number(value)), 'Área Queimada']}
                  labelFormatter={(label) => {
                    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                    return meses[label - 1] || label;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="area_queimada_km2" 
                  stroke="#e74c3c" 
                  strokeWidth={2}
                  dot={{ fill: '#e74c3c', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Comparação com outros biomas */}
      {data.comparacao_biomas && data.comparacao_biomas.length > 0 && (
        <>
          <SectionTitle>Comparação com Outros Biomas</SectionTitle>
          <div style={{ width: '100%', height: '400px', marginBottom: '2rem' }}>
            <ResponsiveContainer>
              <BarChart data={data.comparacao_biomas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="bioma" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tickFormatter={(value) => formatArea(value)} />
                <Tooltip 
                  formatter={(value) => [formatArea(Number(value)), 'Área Queimada']}
                />
                <Bar 
                  dataKey="area_queimada_km2" 
                  fill="#27ae60"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Estados mais afetados no bioma */}
      {data.estados_mais_afetados && data.estados_mais_afetados.length > 0 && (
        <>
          <SectionTitle>Estados Mais Afetados no Bioma</SectionTitle>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <BarChart data={data.estados_mais_afetados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="estado" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tickFormatter={(value) => formatArea(value)} />
                <Tooltip 
                  formatter={(value) => [formatArea(Number(value)), 'Área Queimada']}
                />
                <Bar 
                  dataKey="area_queimada_km2" 
                  fill="#f39c12"
                  radius={[4, 4, 0, 0]}
                />
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
