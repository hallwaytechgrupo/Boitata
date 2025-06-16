import { useState, useEffect } from 'react';
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
import { getEstatisticasAreaQueimadaEstado } from '../../../services/api';

interface AreaQueimadaData {
  ano: number;
  mes: number;
  estado: string;
  area_queimada_km2: number;
}

export default function AreaQueimadaAnaliseEstado() {
  const [dados, setDados] = useState<AreaQueimadaData[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>('');
  const [mesSelecionado, setMesSelecionado] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [estados, setEstados] = useState<string[]>([]);

  const meses = [
    { value: null, label: 'Todos os meses' },
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const buscarDados = async () => {
    setCarregando(true);
    try {
      const resultado = await getEstatisticasAreaQueimadaEstado();
      
      // Extrair lista única de estados
      const estadosUnicos = [...new Set(resultado.map((item: AreaQueimadaData) => item.estado))] as string[];
      setEstados(estadosUnicos);
      
      // Se não há estado selecionado, selecionar o primeiro
      if (!estadoSelecionado && estadosUnicos.length > 0) {
        setEstadoSelecionado(estadosUnicos[0]);
      }
      
      // Filtrar dados por estado e mês
      let dadosFiltrados = resultado;
      
      if (estadoSelecionado) {
        dadosFiltrados = resultado.filter((item: AreaQueimadaData) => 
          item.estado === estadoSelecionado
        );
      }
      
      if (mesSelecionado) {
        dadosFiltrados = dadosFiltrados.filter((item: AreaQueimadaData) => 
          item.mes === mesSelecionado
        );
      }
      
      setDados(dadosFiltrados);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setDados([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, [estadoSelecionado, mesSelecionado]);

  const formatNumero = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatArea = (area: number) => {
    return `${formatNumero(Math.round(area))} km²`;
  };

  const calcularEstatisticas = () => {
    if (dados.length === 0) return null;

    const areaTotal = dados.reduce((acc, item) => acc + item.area_queimada_km2, 0);
    const mediaMensal = areaTotal / dados.length;
    const maiorMes = dados.reduce((prev, current) => 
      prev.area_queimada_km2 > current.area_queimada_km2 ? prev : current
    );

    return {
      areaTotal,
      mediaMensal,
      maiorMes
    };
  };

  const estatisticas = calcularEstatisticas();

  const dadosGraficoLinha = dados.map(item => ({
    ...item,
    mesNome: meses.find(m => m.value === item.mes)?.label || `Mês ${item.mes}`
  }));

  return (
    <Section>
      <SectionTitle>Análise de Área Queimada por Estado</SectionTitle>
      
      {/* Filtros */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div>
          <InfoLabel>Estado:</InfoLabel>
          <select 
            value={estadoSelecionado} 
            onChange={(e) => setEstadoSelecionado(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              marginLeft: '10px',
              minWidth: '150px'
            }}
          >
            <option value="">Selecione um estado</option>
            {estados.map(estado => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <InfoLabel>Mês:</InfoLabel>
          <select 
            value={mesSelecionado || ''} 
            onChange={(e) => setMesSelecionado(e.target.value ? Number(e.target.value) : null)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              marginLeft: '10px',
              minWidth: '150px'
            }}
          >
            {meses.map(mes => (
              <option key={mes.value || 'all'} value={mes.value || ''}>
                {mes.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {carregando ? (
        <InfoText>Carregando dados...</InfoText>
      ) : !estadoSelecionado ? (
        <InfoText>Selecione um estado para visualizar os dados.</InfoText>
      ) : dados.length === 0 ? (
        <InfoText>Nenhum dado encontrado para os filtros selecionados.</InfoText>
      ) : (
        <>
          {/* Métricas principais */}
          {estatisticas && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <InfoCard>
                <InfoLabel>Área queimada total:</InfoLabel>
                <InfoValue>{formatArea(estatisticas.areaTotal)}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Média mensal:</InfoLabel>
                <InfoValue>{formatArea(estatisticas.mediaMensal)}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Maior registro:</InfoLabel>
                <InfoValue>
                  {formatArea(estatisticas.maiorMes.area_queimada_km2)}
                  <br />
                  <small style={{ color: '#666' }}>
                    {meses.find(m => m.value === estatisticas.maiorMes.mes)?.label}
                  </small>
                </InfoValue>
              </InfoCard>
            </div>
          )}

          {/* Gráfico de evolução temporal */}
          {!mesSelecionado && dados.length > 1 && (
            <>
              <SectionTitle>Evolução Temporal da Área Queimada - {estadoSelecionado}</SectionTitle>
              <div style={{ width: '100%', height: '300px', marginBottom: '2rem' }}>
                <ResponsiveContainer>
                  <LineChart data={dadosGraficoLinha}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mesNome" />
                    <YAxis tickFormatter={(value) => formatArea(value)} />
                    <Tooltip 
                      formatter={(value) => [formatArea(Number(value)), 'Área Queimada']}
                      labelFormatter={(label) => `Mês: ${label}`}
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

          {/* Gráfico de barras mensal */}
          <SectionTitle>Distribuição Mensal - {estadoSelecionado}</SectionTitle>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <BarChart data={dadosGraficoLinha}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mesNome" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis tickFormatter={(value) => formatArea(value)} />
                <Tooltip 
                  formatter={(value) => [formatArea(Number(value)), 'Área Queimada']}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Bar 
                  dataKey="area_queimada_km2" 
                  fill="#e74c3c"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <InfoCard>
        <InfoLabel>Última atualização:</InfoLabel>
        <InfoValue>{new Date().toLocaleDateString('pt-BR')}</InfoValue>
      </InfoCard>
    </Section>
  );
}
