import { useState, useEffect } from "react";
import Modal from '../_base/ModalBase';
import { Loader } from "lucide-react";
import { Container, Section, SectionTitle, InfoText, LoadingContainer } from './analises-styled';
import { useFilter } from "../../../contexts/FilterContext";
import { FilterType, PatternType } from "../../../types";

// Import dos subcomponentes
import FocoCalorAnaliseEstado from "./FocoCalorAnaliseEstado";
import AreaQueimadaAnaliseEstado from "./AreaQueimadaAnaliseEstado";
import AnaliseNaoDisponivel from "./AnaliseNaoDisponivel";

interface AnalisesModalProps {
  onClose: () => void;
}

export default function ModalAnalises({ onClose }: AnalisesModalProps) {
  const { filterType, estado, cidade, bioma, patternType } = useFilter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para carregar estatísticas com base no filtro atual
  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        setIsLoading(true);
        // Simulando o carregamento de dados
        // Aqui poderia ter chamadas de API baseadas nos filtros
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
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

  // Renderizar conteúdo com base no tipo de filtro
  const renderConteudo = () => {
    // Se não tiver nenhum filtro específico ativo, mostra a mensagem
    if (filterType !== FilterType.ESTADO && 
        filterType !== FilterType.MUNICIPIO && 
        filterType !== FilterType.BIOMA) {
      return (
        <Section>
          <SectionTitle>Sem dados disponíveis</SectionTitle>
          <InfoText>
            Selecione um estado, município ou bioma para ver estatísticas detalhadas.
          </InfoText>
        </Section>
      );
    }

    // Processa com base no tipo de filtro
    switch (filterType) {
      case FilterType.ESTADO:
        switch (patternType) {
          case PatternType.QUEIMADA:
            return <AnaliseNaoDisponivel />;
          case PatternType.RISCO_FOGO:
            return <AnaliseNaoDisponivel />;
          case PatternType.HEAT_MAP:
            return <FocoCalorAnaliseEstado />;
          default:
            return <AnaliseNaoDisponivel />;;
        }

      case FilterType.MUNICIPIO:
        switch (patternType) {
          case PatternType.QUEIMADA:
            return <AnaliseNaoDisponivel />;;
          case PatternType.RISCO_FOGO:
            return <AnaliseNaoDisponivel />;;
          case PatternType.HEAT_MAP:
            return <FocoCalorAnaliseEstado />;
          default:
            return <AnaliseNaoDisponivel />;;
        }

      case FilterType.BIOMA:
        switch (patternType) {
          case PatternType.QUEIMADA:
            return <AnaliseNaoDisponivel />;;
          case PatternType.RISCO_FOGO:
            return <AnaliseNaoDisponivel />;;
          case PatternType.HEAT_MAP:
            return <AnaliseNaoDisponivel />;;
          default:
            return <AnaliseNaoDisponivel />;;
        }

      default:
        return (
          <Section>
            <SectionTitle>Sem dados disponíveis</SectionTitle>
            <InfoText>
              Selecione um estado, município ou bioma para ver estatísticas detalhadas.
            </InfoText>
          </Section>
        );
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