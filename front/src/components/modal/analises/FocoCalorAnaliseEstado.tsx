import { useState, useEffect } from 'react';
import { 
  Section, 
  SectionTitle, 
  InfoText, 
  ChartCard,
  ChartTitle,
  ChartWrapper,
  LegendContainer,
  LegendItem,
  LegendColor,
  LegendText,
  LegendValue,
  ChartsGrid,
  KpiGrid,
  KpiCard,
  KpiTitle,
  KpiValue,
  KpiDescription,
  LineChartCard,
  BarChartCard,
  ChartIcon,
  TooltipStyle,
  LoadingOverlay,
  LoadingText,
  LoadingSubtext,
  PulsingSatelliteIcon
} from './analises-styled';
import { useFilter } from '../../../contexts/FilterContext';
import { 
  getEstatisticasEstadoFinal,
  getKpiTotalFocosEstado,
  getKpiMesMaiorFocos,
  getKpiRiscoMedioEstado,
  getKpiFocosPorSatelite,
  getGraficoEvolucaoTemporal,
  getGraficoComparacaoSatelite,
  getGraficoDistribuicaoEstado,
  getGraficoCorrelacaoRiscoFocos
} from '../../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#556FB5', '#F7B801', '#7BDFF2', 
  '#B39DDB', '#AED581', '#FF8A65', '#81C784', '#DCE775'
];

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function FocoCalorAnaliseEstado() {
  const { estado, patternType, dateRange } = useFilter();
  const [loading, setLoading] = useState(false);
  const [estadoStats, setEstadoStats] = useState<any>(null);
  const [kpiTotalFocos, setKpiTotalFocos] = useState<any>(null);
  const [kpiMesMaiorFocos, setKpiMesMaiorFocos] = useState<any>(null);
  const [kpiRiscoMedio, setKpiRiscoMedio] = useState<any>(null);
  const [kpiFocosPorSatelite, setKpiFocosPorSatelite] = useState<any>(null);
  const [graficoEvolucaoTemporal, setGraficoEvolucaoTemporal] = useState<any>(null);
  const [graficoComparacaoSatelite, setGraficoComparacaoSatelite] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (estado) {
        setLoading(true);
        try {
          const estadoId = estado.id.toString();
          
          // Carregar todos os dados em paralelo
          const [
            estadoStatsData,
            kpiTotalData,
            kpiMesData,
            kpiRiscoData,
            kpiSateliteData,
            evolucaoData,
            comparacaoData,
          ] = await Promise.allSettled([
            getEstatisticasEstadoFinal(estadoId),
            getKpiTotalFocosEstado(estadoId),
            getKpiMesMaiorFocos(estadoId),
            getKpiRiscoMedioEstado(estadoId),
            getKpiFocosPorSatelite(estadoId),
            getGraficoEvolucaoTemporal(estadoId),
            getGraficoComparacaoSatelite(estadoId),
            getGraficoDistribuicaoEstado(estadoId),
            getGraficoCorrelacaoRiscoFocos(estadoId)
          ]);

          // Definir os dados apenas se a requisição foi bem-sucedida
          if (estadoStatsData.status === 'fulfilled') setEstadoStats(estadoStatsData.value);
          if (kpiTotalData.status === 'fulfilled') setKpiTotalFocos(kpiTotalData.value);
          if (kpiMesData.status === 'fulfilled') setKpiMesMaiorFocos(kpiMesData.value);
          if (kpiRiscoData.status === 'fulfilled') setKpiRiscoMedio(kpiRiscoData.value);
          if (kpiSateliteData.status === 'fulfilled') setKpiFocosPorSatelite(kpiSateliteData.value);
          if (evolucaoData.status === 'fulfilled') setGraficoEvolucaoTemporal(evolucaoData.value);
          if (comparacaoData.status === 'fulfilled') setGraficoComparacaoSatelite(comparacaoData.value);;

        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [estado, dateRange]);

  const formatNumero = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatarData = (dataIso: string) => {
    if (!dataIso) return "N/A";
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR');
  };

  const getNomeMes = (mes: string) => {
    const mesNum = parseInt(mes, 10);
    return MESES[mesNum - 1] || `Mês ${mes}`;
  };

  const patternLabel = patternType ? 
    patternType === 'heatmap' ? 'Focos de Calor' : 
    patternType === 'queimada' ? 'Áreas Queimadas' : 
    patternType === 'risco-fogo' ? 'Risco de Fogo' : 'Análise' 
    : 'Análise';

  return (
    <Section style={{ position: loading ? 'relative' : 'static', minHeight: loading ? '400px' : 'auto' }}>
      {loading ? (
        <LoadingOverlay>
          <PulsingSatelliteIcon />
          <LoadingText>⏳ Carregando dados...</LoadingText>
          <LoadingSubtext>Aguarde enquanto processamos as informações do estado {estado?.nome}</LoadingSubtext>
        </LoadingOverlay>
      ) : !estado ? (
        <>
          <SectionTitle>❌ Dados não disponíveis</SectionTitle>
          <InfoText>Selecione um estado para visualizar a análise.</InfoText>
        </>
      ) : (
        <>
          <SectionTitle>🔥 Estatísticas do Estado: {estado.nome}</SectionTitle>
          <InfoText>📊 Análise: {patternLabel}</InfoText>
          
          {/* Grid de KPIs Melhorado */}
          <KpiGrid>
            {estadoStats && estadoStats.length > 0 && (
              <KpiCard>
                <KpiTitle>📅 Última Atualização</KpiTitle>
                <KpiValue>{formatarData(estadoStats[0].ultima_atualizacao)}</KpiValue>
                <KpiDescription>Data da última atualização dos dados no sistema</KpiDescription>
              </KpiCard>
            )}

            {kpiTotalFocos && kpiTotalFocos.length > 0 && (
              <KpiCard>
                <KpiTitle>🔥 Total de Focos</KpiTitle>
                <KpiValue>{formatNumero(Number(kpiTotalFocos[0].total_focos))}</KpiValue>
                <KpiDescription>Número total de focos de calor detectados no estado</KpiDescription>
              </KpiCard>
            )}
            
            {kpiMesMaiorFocos && kpiMesMaiorFocos.length > 0 && (
              <KpiCard>
                <KpiTitle>📈 Pico Mensal</KpiTitle>
                <KpiValue>{getNomeMes(kpiMesMaiorFocos[0].mes)}</KpiValue>
                <KpiDescription>
                  Mês com maior incidência: {formatNumero(Number(kpiMesMaiorFocos[0].total_focos))} focos detectados
                </KpiDescription>
              </KpiCard>
            )}
            
            {kpiRiscoMedio && kpiRiscoMedio.length > 0 && (
              <KpiCard>
                <KpiTitle>⚠️ Risco Médio</KpiTitle>
                <KpiValue>{Number(kpiRiscoMedio[0].risco_medio).toFixed(2)}</KpiValue>
                <KpiDescription>Índice médio de risco de fogo calculado para o estado</KpiDescription>
              </KpiCard>
            )}

            {estadoStats && estadoStats.length > 0 && estadoStats[0].maior_frp && (
              <KpiCard>
                <KpiTitle>💥 Maior FRP</KpiTitle>
                <KpiValue>{estadoStats[0].maior_frp.frp.toFixed(2)} MW</KpiValue>
                <KpiDescription>
                  Maior poder radiativo registrado em {estadoStats[0].maior_frp.municipio} 
                  ({formatarData(estadoStats[0].maior_frp.data)})
                </KpiDescription>
              </KpiCard>
            )}
          </KpiGrid>

          {/* Grid de Gráficos */}
          <ChartsGrid>
            {/* Evolução Temporal */}
            {graficoEvolucaoTemporal && graficoEvolucaoTemporal.length > 0 && (
              <LineChartCard>
                <ChartTitle>
                  <ChartIcon>📈</ChartIcon>
                  Evolução Mensal de Focos
                </ChartTitle>
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={graficoEvolucaoTemporal.map((item: any) => ({
                        ...item,
                        nomeMes: getNomeMes(item.mes),
                        total_focos: Number(item.total_focos)
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="nomeMes" 
                        stroke="#94a3b8" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip 
                        formatter={(value) => [formatNumero(Number(value)), 'Focos de Calor']} 
                        contentStyle={TooltipStyle}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total_focos" 
                        name="Focos de Calor" 
                        stroke="#ff6b6b" 
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#ff6b6b', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, fill: '#ff4757', strokeWidth: 2, stroke: '#fff' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </LineChartCard>
            )}

            {/* Distribuição por Satélite */}
            {kpiFocosPorSatelite && kpiFocosPorSatelite.length > 0 && (
              <ChartCard>
                <ChartTitle>
                  <ChartIcon>🛰️</ChartIcon>
                  Distribuição de Focos por Satélite
                </ChartTitle>
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={kpiFocosPorSatelite.map((item: any) => ({
                          ...item,
                          total_focos: Number(item.total_focos),
                          percentual: Number(item.percentual)
                        }))}
                        dataKey="total_focos"
                        nameKey="satelite"
                        cx="50%"
                        cy="45%"
                        outerRadius={130}
                        innerRadius={60}
                        paddingAngle={3}
                        startAngle={90}
                        endAngle={450}
                        label={({ percent }) => 
                          percent > 0.05 ? `${(percent * 100).toFixed(1)}%` : ''
                        }
                        labelLine={false}
                        fontSize={12}
                        fontWeight="600"
                      >
                        {kpiFocosPorSatelite.map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => {
                          const item = props.payload;
                          return [
                            `${formatNumero(Number(value))} focos`, 
                            `${Number(item.percentual).toFixed(2)}%`
                          ];
                        }}
                        labelFormatter={(label) => `Satélite: ${label}`}
                        contentStyle={TooltipStyle}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartWrapper>
                
                <LegendContainer>
                  {kpiFocosPorSatelite.map((item: any, index: number) => (
                    <LegendItem key={`legend-${index}`}>
                      <LegendColor color={COLORS[index % COLORS.length]} />
                      <LegendText>{item.satelite}</LegendText>
                      <LegendValue>
                        {formatNumero(Number(item.total_focos))} 
                        ({Number(item.percentual).toFixed(1)}%)
                      </LegendValue>
                    </LegendItem>
                  ))}
                </LegendContainer>
              </ChartCard>
            )}

            {/* Comparação de Satélites */}
            {graficoComparacaoSatelite && graficoComparacaoSatelite.length > 0 && (
              <BarChartCard>
                <ChartTitle>
                  <ChartIcon>📊</ChartIcon>
                  Comparação de Focos por Satélite
                </ChartTitle>
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical"
                      data={graficoComparacaoSatelite.map((item: any) => ({
                        ...item,
                        total_focos: Number(item.total_focos)
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                      <YAxis dataKey="satelite" type="category" width={120} stroke="#94a3b8" fontSize={12} />
                      <Tooltip 
                        formatter={(value) => [formatNumero(Number(value)), 'Focos de Calor']}
                        contentStyle={TooltipStyle}
                      />
                      <Legend />
                      <Bar 
                        dataKey="total_focos" 
                        fill="url(#barGradient)" 
                        name="Focos de Calor"
                        radius={[0, 4, 4, 0]}
                      />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#4ecdc4" />
                          <stop offset="100%" stopColor="#44a08d" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </BarChartCard>
            )}

            {/* Top Cidades */}
            {estadoStats && estadoStats.length > 0 && estadoStats[0].top_cidades && estadoStats[0].top_cidades.length > 0 && (
              <BarChartCard>
                <ChartTitle>
                  <ChartIcon>🏙️</ChartIcon>
                  Municípios com Maior Incidência
                </ChartTitle>
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={estadoStats[0].top_cidades}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="municipio" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        stroke="#94a3b8"
                        fontSize={11}
                      />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip 
                        formatter={(value) => [formatNumero(Number(value)), 'Focos de Calor']}
                        contentStyle={TooltipStyle}
                      />
                      <Legend />
                      <Bar 
                        dataKey="total_focos" 
                        fill="url(#cityGradient)" 
                        name="Focos de Calor"
                        radius={[4, 4, 0, 0]}
                      />
                      <defs>
                        <linearGradient id="cityGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ff6b6b" />
                          <stop offset="100%" stopColor="#ff4757" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </BarChartCard>
            )}
          </ChartsGrid>
        </>
      )}
    </Section>
  );
}