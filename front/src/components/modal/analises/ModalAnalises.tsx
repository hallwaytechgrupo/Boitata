import { useState, useEffect } from "react";
import Modal from '../_base/ModalBase';
import { Loader } from "lucide-react";
import { Container, Section, SectionTitle, InfoText, LoadingContainer } from './analises-styled';
import { useFilter } from "../../../contexts/FilterContext";
import { FilterType, PatternType } from "../../../types";
import { 
  getEstatisticasEstado, 
  getEstatisticasMunicipio, 
  getEstatisticasBioma 
} from "../../../services/api";

// Import dos subcomponentes
import FocoCalorAnaliseEstado from "./FocoCalorAnaliseEstado";
import FocoCalorAnaliseMunicipio from "./FocoCalorAnaliseMunicipio";
import FocoCalorAnaliseBioma from "./FocoCalorAnaliseBioma";
import AreaQueimadaAnaliseEstado from "./AreaQueimadaAnaliseEstado";

interface AnalisesModalProps {
  onClose: () => void;
}

export default function ModalAnalises({ onClose }: AnalisesModalProps) {
  const { filterType, estado, cidade, bioma, patternType } = useFilter();
  const [estatisticasData, setEstatisticasData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para carregar estatísticas com base no filtro atual
  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        setIsLoading(true);
        
        let dados = null;
        
        // Buscar dados com base no filtro ativo e padrão
        switch (filterType) {
          case FilterType.ESTADO:
            if (estado) {
              // Considerar patternType para diferentes análises
              if (patternType === PatternType.HEAT_MAP) {
                dados = await getEstatisticasEstado(estado.id.toString());
              } else if (patternType === PatternType.QUEIMADA) {
                dados = await getEstatisticasEstado(estado.id.toString());
              } else if (patternType === PatternType.RISCO_FOGO) {
                dados = await getEstatisticasEstado(estado.id.toString());
              }
              console.log(`Dados do estado carregados (${patternType}):`, dados);
            }
            break;

          case FilterType.MUNICIPIO:
            if (cidade) {
              // Considerar patternType para diferentes análises
              if (patternType === PatternType.HEAT_MAP) {
                dados = await getEstatisticasMunicipio(cidade.id.toString());
              } else if (patternType === PatternType.QUEIMADA) {
                dados = await getEstatisticasMunicipio(cidade.id.toString());
              } else if (patternType === PatternType.RISCO_FOGO) {
                dados = await getEstatisticasMunicipio(cidade.id.toString());
              }
              console.log(`Dados do município carregados (${patternType}):`, dados);
            }
            break;

          case FilterType.BIOMA:
            if (bioma) {
              // Considerar patternType para diferentes análises
              if (patternType === PatternType.HEAT_MAP) {
                dados = await getEstatisticasBioma(bioma.id.toString());
              } else if (patternType === PatternType.QUEIMADA) {
                dados = await getEstatisticasBioma(bioma.id.toString());
              } else if (patternType === PatternType.RISCO_FOGO) {
                dados = await getEstatisticasBioma(bioma.id.toString());
              }
              console.log(`Dados do bioma carregados (${patternType}):`, dados);
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
    
  }, [filterType, estado, cidade, bioma, patternType]);

  // Função para obter o título do padrão
  const getPatternLabel = () => {
    switch (patternType) {
      case PatternType.HEAT_MAP:
        return 'Mapa de Calor';
      case PatternType.BIOMA:
        return 'Análise por Bioma';
      case PatternType.QUEIMADA:
        return 'Focos de Queimada';
      case PatternType.RISCO_FOGO:
        return 'Risco de Fogo';
      case PatternType.ESTADO:
        return 'Análise por Estado';
      default:
        return 'Análise Geral';
    }
  };

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

    const patternLabel = getPatternLabel();

    switch (filterType) {
      case FilterType.ESTADO:
        switch (patternType) {
          case PatternType.QUEIMADA:
            return <AreaQueimadaAnaliseEstado />;
            case PatternType.RISCO_FOGO:
              return <div>Heat Map Estado em desenvolvimento...</div>;
              case PatternType.HEAT_MAP:
            return <FocoCalorAnaliseEstado data={estatisticasData} patternLabel={patternLabel} />;
          default:
            return <FocoCalorAnaliseEstado data={estatisticasData} patternLabel={patternLabel} />;
        }

      case FilterType.MUNICIPIO:
        switch (patternType) {
          case PatternType.QUEIMADA:
            return <div>Risco de Fogo Município em desenvolvimento...</div>;
            case PatternType.RISCO_FOGO:
              return <FocoCalorAnaliseMunicipio data={estatisticasData} patternLabel={patternLabel} />;
              case PatternType.HEAT_MAP:
            return <div>Heat Map Município em desenvolvimento...</div>;
          default:
            return <FocoCalorAnaliseMunicipio data={estatisticasData} patternLabel={patternLabel} />;
        }

      case FilterType.BIOMA:
        switch (patternType) {
          case PatternType.QUEIMADA:
            return <div>Risco de Fogo Bioma em desenvolvimento...</div>;
          case PatternType.RISCO_FOGO:
            return <div>Heat Map Bioma em desenvolvimento...</div>;
          case PatternType.HEAT_MAP:
            return <FocoCalorAnaliseBioma data={estatisticasData} patternLabel={patternLabel} />;
          default:
            return <FocoCalorAnaliseBioma data={estatisticasData} patternLabel={patternLabel} />;
        }

      default:
        return null;
    }
  };

  return (
    <Modal title="Análises" onClose={onClose} customHeight="80vh" customWidth="70vw">
      <Container>
        {renderConteudo()}
      </Container>
    </Modal>
  );
}