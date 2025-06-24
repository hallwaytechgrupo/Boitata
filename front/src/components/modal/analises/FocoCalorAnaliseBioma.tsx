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
  ScatterChartCard,
  ChartIcon,
  TooltipStyle,
  LoadingOverlay,
  LoadingText,
  LoadingSubtext,
  PulsingSatelliteIcon
} from './analises-styled';
import { useFilter } from '../../../contexts/FilterContext';
import { 
  getKpiBioma,
  getDistribuicaoFocosPorBioma,
  getDispersaoFrpMedioPorDia,
  getTop5DiasMaisFocosPorBioma,
  getCrescimentoFocosDiariosTop5Biomas,
  getMediaDiariaFocosBioma,
  getEvolucaoHistoricaBioma
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
  ScatterChart,
  Scatter,
  Legend,
} from 'recharts';

const COLORS = [
  '#ff7300', '#ff4500', '#ff6b35', '#ff8c42', '#ff9f1c', 
  '#ffb627', '#ffa726', '#ff5722', '#e65100', '#bf360c'
];

export default function FocoCalorAnaliseBioma() {
  const { bioma, patternType, dateRange } = useFilter();
  const [loading, setLoading] = useState(false);
  const [kpiBiomaData, setKpiBiomaData] = useState<any>(null);
  const [distribuicaoFocos, setDistribuicaoFocos] = useState<any>(null);
  const [dispersaoFrp, setDispersaoFrp] = useState<any>(null);
  const [top5Dias, setTop5Dias] = useState<any>(null);
  const [crescimentoFocos, setCrescimentoFocos] = useState<any>(null);
  const [mediaDiaria, setMediaDiaria] = useState<any>(null);
  const [evolucaoHistorica, setEvolucaoHistorica] = useState<any>(null);
  const [biomaAtual, setBiomaAtual] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Carregar dados gerais dos biomas
        const [
          kpiData,
          distribuicaoData,
          dispersaoData,
          top5Data,
          crescimentoData
        ] = await Promise.allSettled([
          getKpiBioma(),
          getDistribuicaoFocosPorBioma(),
          getDispersaoFrpMedioPorDia(),
          getTop5DiasMaisFocosPorBioma(),
          getCrescimentoFocosDiariosTop5Biomas()
        ]);

        if (kpiData.status === 'fulfilled') setKpiBiomaData(kpiData.value);
        if (distribuicaoData.status === 'fulfilled') setDistribuicaoFocos(distribuicaoData.value);
        if (dispersaoData.status === 'fulfilled') setDispersaoFrp(dispersaoData.value);
        if (top5Data.status === 'fulfilled') setTop5Dias(top5Data.value);
        if (crescimentoData.status === 'fulfilled') setCrescimentoFocos(crescimentoData.value);

        // Carregar dados específicos do bioma selecionado
        if (bioma) {
          const biomaId = bioma.id.toString();
          
          const [mediaData, evolucaoData] = await Promise.allSettled([
            getMediaDiariaFocosBioma(biomaId),
            getEvolucaoHistoricaBioma(biomaId)
          ]);

          if (mediaData.status === 'fulfilled') setMediaDiaria(mediaData.value);
          if (evolucaoData.status === 'fulfilled') setEvolucaoHistorica(evolucaoData.value);

          // Encontrar dados do bioma atual nos KPIs gerais
          if (kpiData.status === 'fulfilled' && kpiData.value) {
            const biomaAtualData = kpiData.value.find((item: any) => 
              item.id_bioma === bioma.id || item.bioma === bioma.nome
            );
            setBiomaAtual(biomaAtualData);
          }
        }

      } catch (error) {
        console.error('Erro ao carregar dados dos biomas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bioma, dateRange]);

  const formatNumero = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatarData = (dataStr: string) => {
    if (!dataStr) return "N/A";
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
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
          <LoadingText>Carregando análise de biomas...</LoadingText>
          <LoadingSubtext>Processando dados estatísticos dos biomas brasileiros</LoadingSubtext>
        </LoadingOverlay>
      ) : (
        <>
          {/* KPIs do Bioma Atual (se selecionado) */}
          {bioma && biomaAtual && (
            <>
              <SectionTitle>{bioma.nome} - Indicadores Específicos</SectionTitle>
              <KpiGrid>
                <KpiCard>
                  <KpiTitle>Total de Focos (30 dias)</KpiTitle>
                  <KpiValue>{formatNumero(Number(biomaAtual.total_focos_30dias))}</KpiValue>
                  <KpiDescription>Focos de calor detectados nos últimos 30 dias</KpiDescription>
                </KpiCard>

                <KpiCard>
                  <KpiTitle>FRP Médio</KpiTitle>
                  <KpiValue>{Number(biomaAtual.frp_medio).toFixed(2)} MW</KpiValue>
                  <KpiDescription>Poder radiativo médio dos focos detectados</KpiDescription>
                </KpiCard>

                <KpiCard>
                  <KpiTitle>Dias com Ocorrências</KpiTitle>
                  <KpiValue>{formatNumero(Number(biomaAtual.dias_com_focos))}</KpiValue>
                  <KpiDescription>Dias com detecção de focos no período</KpiDescription>
                </KpiCard>

                {mediaDiaria && mediaDiaria.length > 0 && (
                  <KpiCard>
                    <KpiTitle>Média Diária</KpiTitle>
                    <KpiValue>{Number(mediaDiaria[0].media_diaria_focos).toFixed(1)}</KpiValue>
                    <KpiDescription>Média de focos por dia no bioma</KpiDescription>
                  </KpiCard>
                )}
              </KpiGrid>
            </>
          )}

          {/* KPIs Gerais dos Biomas */}
          <SectionTitle>Panorama Geral dos Biomas</SectionTitle>
          {kpiBiomaData && kpiBiomaData.length > 0 && (
            <KpiGrid>
              <KpiCard>
                <KpiTitle>Bioma Crítico</KpiTitle>
                <KpiValue>{kpiBiomaData[0].bioma}</KpiValue>
                <KpiDescription>
                  {formatNumero(Number(kpiBiomaData[0].total_focos_30dias))} focos registrados
                </KpiDescription>
              </KpiCard>

              <KpiCard>
                <KpiTitle>Total de Ocorrências</KpiTitle>
                <KpiValue>{formatNumero(kpiBiomaData.reduce((acc: number, item: any) => acc + Number(item.total_focos_30dias), 0))}</KpiValue>
                <KpiDescription>Soma total de focos em todos os biomas</KpiDescription>
              </KpiCard>

              <KpiCard>
                <KpiTitle>Biomas Afetados</KpiTitle>
                <KpiValue>{kpiBiomaData.filter((item: any) => Number(item.total_focos_30dias) > 0).length}</KpiValue>
                <KpiDescription>Biomas com ocorrências no período</KpiDescription>
              </KpiCard>
            </KpiGrid>
          )}

          {/* Grid de Gráficos */}
          <ChartsGrid>
            {/* 1. Distribuição de Focos por Bioma - Visão Geral */}
            {distribuicaoFocos && distribuicaoFocos.length > 0 && (
              <ChartCard>
                <ChartTitle>
                  <ChartIcon>📊</ChartIcon>
                  Distribuição por Bioma
                </ChartTitle>

                <ChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribuicaoFocos.map((item: any) => ({
                          ...item,
                          total_focos_30dias: Number(item.total_focos_30dias)
                        }))}
                        dataKey="total_focos_30dias"
                        nameKey="bioma"
                        cx="50%"
                        cy="45%"
                        outerRadius={120}
                        innerRadius={50}
                        paddingAngle={1}
                        label={({ percent }) => 
                          percent > 0.05 ? `${(percent * 100).toFixed(1)}%` : ''
                        }
                        labelLine={false}
                        fontSize={10}
                        fontWeight="500"
                      >
                        {distribuicaoFocos.map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            stroke="rgba(255, 255, 255, 0.8)"
                            strokeWidth={1}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${formatNumero(Number(value))} focos`, 'Total']}
                        contentStyle={TooltipStyle}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartWrapper>
                
                <LegendContainer>
                  {distribuicaoFocos.map((item: any, index: number) => (
                    <LegendItem key={`legend-${index}`}>
                      <LegendColor color={COLORS[index % COLORS.length]} />
                      <LegendText>{item.bioma}</LegendText>
                      <LegendValue>{formatNumero(Number(item.total_focos_30dias))}</LegendValue>
                    </LegendItem>
                  ))}
                </LegendContainer>
              </ChartCard>
            )}

            {/* 2. Evolução Temporal - Principais Biomas */}
            {crescimentoFocos && crescimentoFocos.length > 0 && (
              <LineChartCard>
                <ChartTitle>
                  <ChartIcon>📈</ChartIcon>
                  Evolução Temporal - Principais Biomas
                </ChartTitle>
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={(() => {
                        const groupedByDay = crescimentoFocos.reduce((acc: any, item: any) => {
                          const dia = formatarData(item.dia);
                          if (!acc[dia]) acc[dia] = { dia };
                          acc[dia][item.bioma] = Number(item.total_focos);
                          return acc;
                        }, {});
                        return Object.values(groupedByDay);
                      })()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis 
                        dataKey="dia" 
                        stroke="#94a3b8" 
                        fontSize={9}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip 
                        formatter={(value, name) => [formatNumero(Number(value)), name]}
                        contentStyle={TooltipStyle}
                      />
                      <Legend />
                      {Array.from(new Set(crescimentoFocos.map((item: any) => item.bioma))).map((bioma, index) => (
                        <Line 
                          key={bioma}
                          type="monotone" 
                          dataKey={bioma as string}
                          name={bioma as string}
                          stroke={COLORS[index % COLORS.length]} 
                          strokeWidth={2}
                          dot={{ r: 2 }}
                          connectNulls={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </LineChartCard>
            )}

            {/* 3. Histórico Detalhado do Bioma Selecionado */}
            {bioma && evolucaoHistorica && evolucaoHistorica.length > 0 && (
              <LineChartCard>
                <ChartTitle>
                  <ChartIcon>📊</ChartIcon>
                  Histórico Detalhado - {bioma.nome}
                </ChartTitle>
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={evolucaoHistorica.map((item: any) => ({
                        ...item,
                        total_focos: Number(item.total_focos),
                        frp_medio: Number(item.frp_medio),
                        dia: formatarData(item.dia)
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis 
                        dataKey="dia" 
                        stroke="#94a3b8" 
                        fontSize={9}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        yAxisId="left"
                        stroke="#94a3b8" 
                        fontSize={11}
                        label={{ value: 'Focos', angle: -90, position: 'insideLeft' }}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="#ff7300"
                        fontSize={11}
                        label={{ value: 'FRP (MW)', angle: 90, position: 'insideRight' }}
                      />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'FRP Médio (MW)' ? `${Number(value).toFixed(2)} MW` : formatNumero(Number(value)),
                          name
                        ]}
                        contentStyle={TooltipStyle}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="total_focos" 
                        name="Focos de Calor" 
                        stroke="#ff7300" 
                        strokeWidth={3}
                        dot={{ r: 3, fill: '#ff7300' }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="frp_medio" 
                        name="FRP Médio (MW)" 
                        stroke="#e4670a" 
                        strokeWidth={2}
                        dot={{ r: 2, fill: '#e4670a' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </LineChartCard>
            )}

            {/* 4. Dias com Maior Incidência */}
            {top5Dias && top5Dias.length > 0 && (
              <BarChartCard>
                <ChartTitle>
                  <ChartIcon>📊</ChartIcon>
                  Dias com Maior Incidência
                </ChartTitle>
                <ChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={top5Dias.slice(0, 10).map((item: any) => ({
                        ...item,
                        total_focos: Number(item.total_focos),
                        label: `${item.bioma.substring(0, 10)} - ${formatarData(item.dia).substring(0, 5)}`
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis 
                        dataKey="label"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        stroke="#94a3b8"
                        fontSize={9}
                      />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip 
                        formatter={(value) => [formatNumero(Number(value)), 'Focos']}
                        labelFormatter={(label) => label}
                        contentStyle={TooltipStyle}
                      />
                      <Bar 
                        dataKey="total_focos" 
                        fill="#ff7300" 
                        name="Focos"
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </BarChartCard>
            )}

            {/* 5. Correlação FRP vs Focos - Análise Técnica */}
            {dispersaoFrp && dispersaoFrp.length > 0 && (
              <ScatterChartCard>
              <ChartTitle>
                <ChartIcon>📈</ChartIcon>
                Correlação FRP vs Focos Diários
              </ChartTitle>
              <ChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  data={dispersaoFrp.map((item: any) => ({
                  ...item,
                  total_focos: Number(item.total_focos),
                  frp_medio: Number(item.frp_medio)
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis
                  dataKey="frp_medio"
                  type="number"
                  name="FRP médio (MW)"
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{
                    value: "FRP médio (MW)",
                    position: "insideBottom",
                    offset: -10,
                    fontSize: 12,
                    fill: "#94a3b8"
                  }}
                  />
                  <YAxis
                  dataKey="total_focos"
                  type="number"
                  name="Total de focos diários"
                  stroke="#94a3b8"
                  fontSize={11}
                  label={{
                    value: "Total de focos diários",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 12,
                    fill: "#94a3b8"
                  }}
                  />
                  <Tooltip
                  formatter={(value, name) => {
                    if (name === 'frp_medio') {
                    return [`${Number(value).toFixed(2)} MW`, 'FRP médio (MW)'];
                    }
                    if (name === 'total_focos') {
                    return [formatNumero(Number(value)), 'Total de focos diários'];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(_, payload) =>
                    payload && payload.length && payload[0].payload.bioma
                    ? `Bioma: ${payload[0].payload.bioma}`
                    : ''
                  }
                  contentStyle={TooltipStyle}
                  />
                  <Scatter fill="#ff7300" />
                </ScatterChart>
                </ResponsiveContainer>
              </ChartWrapper>
              <InfoText style={{ marginTop: 8, fontSize: 13, color: "#b0b7c3" }}>
                <b>Eixo X:</b> FRP médio (MW) – Representa a intensidade média das queimadas em um dia para cada bioma.<br />
                <b>Eixo Y:</b> Total de focos diários – Indica o número de focos de calor registrados em um dia para cada bioma.
              </InfoText>
              </ScatterChartCard>
            )}
          </ChartsGrid>
        </>
      )}
    </Section>
  );
}