import { 
  Section, 
  SectionTitle, 
  LoadingCard,
  LoadingText,
  LoadingSubtext
} from './analises-styled';
import { useFilter } from '../../../contexts/FilterContext';

export default function AnaliseNaoDisponivel() {
  const { estado, cidade, bioma, patternType } = useFilter();
  
  const getFilterText = () => {
    if (estado) return `Estado - ${estado.nome}`;
    if (cidade) return `Município - ${cidade.nome}`;
    if (bioma) return `Bioma - ${bioma.nome}`;
    return 'filtro selecionado';
  };

  const getAnalysisType = () => {
    switch (patternType) {
      case 'heatmap':
        return 'Focos de Calor';
      case 'queimada':
        return 'Áreas Queimadas';
      case 'risco-fogo':
        return 'Risco de Fogo';
      default:
        return 'Análise';
    }
  };

  return (
    <Section>
      <SectionTitle>📊 {getAnalysisType()}</SectionTitle>
      
      <LoadingCard>
        <LoadingText>❌ Análise não disponível</LoadingText>
        <LoadingSubtext>
          Consulte o BI para gerar as métricas para o {getAnalysisType()} - {getFilterText()}
        </LoadingSubtext>
      </LoadingCard>
    </Section>
  );
}