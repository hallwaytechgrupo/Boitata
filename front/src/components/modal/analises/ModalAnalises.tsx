import { useState, useEffect } from "react";
import Modal from '../_base/ModalBase';
import { Loader } from "lucide-react";
import { Container, Section, SectionTitle, InfoText, InfoCard, InfoLabel, InfoValue, LoadingContainer } from './analises-styled';
import { useFilter } from "../../../contexts/FilterContext";
import { FilterType } from "../../../types";
import { 
  getEstatisticasEstado, 
  getEstatisticasMunicipio, 
  getEstatisticasBioma 
} from "../../../services/api";

interface AnalisesModalProps {
  onClose: () => void;
}

export default function ModalAnalises({ onClose }: AnalisesModalProps) {
  const { filterType, estado, cidade, bioma } = useFilter();
  const [estatisticasData, setEstatisticasData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para carregar estatísticas com base no filtro atual
  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        setIsLoading(true);
        
        let dados = null;
        
        // Buscar dados com base no filtro ativo
        switch (filterType) {
          case FilterType.ESTADO:
            if (estado) {
              dados = await getEstatisticasEstado(estado.id.toString());
              console.log("Dados do estado carregados:", dados);
            }
            break;

          case FilterType.MUNICIPIO:
            if (cidade) {
              dados = await getEstatisticasMunicipio(cidade.id.toString());
              console.log("Dados do município carregados:", dados);
            }
            break;

          case FilterType.BIOMA:
            if (bioma) {
              dados = await getEstatisticasBioma(bioma.id.toString());
              console.log("Dados do bioma carregados:", dados);
            }
            break;
        }
        
        setEstatisticasData(dados);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    carregarEstatisticas();
    
    // As dependências são os IDs dos filtros, não as funções ou objetos completos
  }, [filterType, estado, cidade, bioma]);

  // Função para formatar números grandes
  const formatNumero = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  // Formatar data
  const formatarData = (dataIso: string) => {
    if (!dataIso) return "N/A";
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR');
  };

  // O restante do componente permanece igual...
  if (isLoading) {
    return (
      <Modal title="Análises" onClose={onClose}>
        <LoadingContainer>
          <Loader size={48} className="animate-spin" />
          <p>Carregando estatísticas...</p>
        </LoadingContainer>
      </Modal>
    );
  }

  // Renderizar conteúdo com base no tipo de filtro
  const renderConteudo = () => {
    if (!estatisticasData) {
      return (
        <Section>
          <SectionTitle>Sem dados disponíveis</SectionTitle>
          <InfoText>
            Selecione um estado, município ou bioma para ver estatísticas detalhadas.
          </InfoText>
        </Section>
      );
    }

    switch (filterType) {
      case FilterType.ESTADO:
        return (
          <>
            <Section>
              <SectionTitle>Estatísticas do Estado: {estado?.nome}</SectionTitle>
              
              <InfoCard>
                <InfoLabel>Total de focos nos últimos 30 dias:</InfoLabel>
                <InfoValue>{formatNumero(estatisticasData.total_focos_30dias || 0)} focos</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Risco médio de fogo:</InfoLabel>
                <InfoValue>{(estatisticasData.risco_fogo_medio || 0).toFixed(2)}%</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Poder radiativo médio (FRP):</InfoLabel>
                <InfoValue>{(estatisticasData.frp_medio || 0).toFixed(2)} MW</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Última atualização:</InfoLabel>
                <InfoValue>{formatarData(estatisticasData.ultima_atualizacao)}</InfoValue>
              </InfoCard>
              
              {estatisticasData.top_cidades && (
                <>
                  <SectionTitle>Top Municípios Afetados</SectionTitle>
                  {estatisticasData.top_cidades.map((cidade: any, index: number) => (
                    <InfoCard key={index}>
                      <InfoLabel>{index + 1}. {cidade.municipio}</InfoLabel>
                      <InfoValue>{formatNumero(cidade.total_focos)} focos</InfoValue>
                    </InfoCard>
                  ))}
                </>
              )}
            </Section>
          </>
        );

        case FilterType.MUNICIPIO:
          return (
            <>
          <Section>
            <SectionTitle>Estatísticas do Município: {estatisticasData.municipio} - {estatisticasData.estado}</SectionTitle>
            
            <InfoCard>
              <InfoLabel>Total de focos nos últimos 30 dias:</InfoLabel>
              <InfoValue>{formatNumero(Number(estatisticasData.total_focos_30dias) || 0)} focos</InfoValue>
            </InfoCard>
            
            <InfoCard>
              <InfoLabel>Risco médio de fogo:</InfoLabel>
              <InfoValue>{(Number.parseFloat(estatisticasData.risco_fogo_medio) * 100).toFixed(2)}%</InfoValue>
            </InfoCard>
            
            <InfoCard>
              <InfoLabel>Risco máximo de fogo:</InfoLabel>
              <InfoValue>{(Number.parseFloat(estatisticasData.risco_fogo_maximo) * 100).toFixed(2)}%</InfoValue>
            </InfoCard>
            
            <InfoCard>
              <InfoLabel>Poder radiativo médio (FRP):</InfoLabel>
              <InfoValue>{Number.parseFloat(estatisticasData.frp_medio).toFixed(2)} MW</InfoValue>
            </InfoCard>
            
            <InfoCard>
              <InfoLabel>Poder radiativo máximo (FRP):</InfoLabel>
              <InfoValue>{Number.parseFloat(estatisticasData.frp_maximo).toFixed(2)} MW</InfoValue>
            </InfoCard>
            
            <InfoCard>
              <InfoLabel>Última atualização:</InfoLabel>
              <InfoValue>{formatarData(estatisticasData.ultima_atualizacao)}</InfoValue>
            </InfoCard>
            
            {estatisticasData.deteccao_satelites && estatisticasData.deteccao_satelites.length > 0 && (
              <>
            <SectionTitle>Detecção por Satélites</SectionTitle>
            {estatisticasData.deteccao_satelites.map((sat: any, index: number) => (
              <InfoCard key={index}>
                <InfoLabel>Satélite {sat.satelite}:</InfoLabel>
                <InfoValue>{formatNumero(Number(sat.total_focos) || 0)} detecções</InfoValue>
              </InfoCard>
            ))}
              </>
            )}

            {estatisticasData.serie_historica && estatisticasData.serie_historica.length > 0 && (
              <>
            <SectionTitle>Série Histórica (últimos meses)</SectionTitle>
            {estatisticasData.serie_historica.map((item: any, index: number) => (
              <InfoCard key={index}>
                <InfoLabel>{item.mes}</InfoLabel>
                <InfoValue>{formatNumero(Number(item.total) || 0)} focos</InfoValue>
              </InfoCard>
            ))}
              </>
            )}
          </Section>
            </>
          );

      case FilterType.BIOMA:
        return (
          <>
            <Section>
              <SectionTitle>Estatísticas do Bioma: {bioma?.nome}</SectionTitle>
              
              <InfoCard>
                <InfoLabel>Área total do bioma:</InfoLabel>
                <InfoValue>{formatNumero(Math.round(estatisticasData.area_km2 || 0))} km²</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Total de focos nos últimos 30 dias:</InfoLabel>
                <InfoValue>{formatNumero(estatisticasData.total_focos_30dias || 0)} focos</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Total de focos histórico:</InfoLabel>
                <InfoValue>{formatNumero(estatisticasData.total_focos_historico || 0)} focos</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Densidade de focos por km²:</InfoLabel>
                <InfoValue>{estatisticasData.densidade_focos_por_km2?.toFixed(4) || 0}</InfoValue>
              </InfoCard>
              
              <InfoCard>
                <InfoLabel>Última atualização:</InfoLabel>
                <InfoValue>{formatarData(estatisticasData.ultima_atualizacao)}</InfoValue>
              </InfoCard>
              
              {estatisticasData.top_municipios_afetados && estatisticasData.top_municipios_afetados.length > 0 && (
                <>
                  <SectionTitle>Top Municípios Afetados</SectionTitle>
                  {estatisticasData.top_municipios_afetados.map((mun: any, index: number) => (
                    <InfoCard key={index}>
                      <InfoLabel>{index + 1}. {mun.municipio} - {mun.estado}</InfoLabel>
                      <InfoValue>{formatNumero(mun.total_focos)} focos</InfoValue>
                    </InfoCard>
                  ))}
                </>
              )}
            </Section>
          </>
        );

      // Os outros cases (MUNICIPIO, BIOMA, default) continuam iguais
    };
  };

  return (
    <Modal title="Análises" onClose={onClose} customHeight="80vh" customWidth="70vw">
      <Container>
        {renderConteudo()}
      </Container>
    </Modal>
  );
}