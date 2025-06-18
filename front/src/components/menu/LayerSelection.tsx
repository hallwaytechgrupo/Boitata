import type React from 'react';
import { useState, useEffect } from 'react';
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { Layers, Flame, AlertTriangle, MapIcon, Loader, Map } from 'lucide-react';
import { useMap } from '../../hooks/useMap';
import { patterns, PatternType } from '../../types';
import { LayerContainer, LayerHeader, LayerButton, ButtonIcon, ButtonLabel, GroupDivider, LoadingContainer, LoadingText } from '../../styles/styles';

interface LayersNavigationProps {
  activePatterns: PatternType[];
  onTogglePattern: (pattern: PatternType) => void;
}

const LayersNavigation: React.FC<LayersNavigationProps> = ({ 
  activePatterns,
  onTogglePattern
}) => {
  const { updateLayerData, isMapLoaded, mapRef, allPatternsInitialized } = useMap();
  const [canShowControls, setCanShowControls] = useState(false);
  
  // Verificação mais robusta para o carregamento do mapa
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
      useEffect(() => {
    console.log("Verificando se o mapa está carregado...", {
      isMapLoaded,
      allPatternsInitialized,
      mapExists: !!mapRef?.current
    });
    console.log("Active patterns on load:", activePatterns);
    
    // Verificar se o mapa está carregado E os padrões estão inicializados
    if (isMapLoaded && allPatternsInitialized) {
      console.log("Mapa e padrões carregados - mostrando controles");
      setCanShowControls(true);
      return;
    }
    
    // Verificação alternativa - mapRef.current existe?
    if (mapRef?.current && allPatternsInitialized) {
      console.log("Map ref exists and patterns initialized - mostrando controles");
      setCanShowControls(true);
      return;
    }
    
    // Se nenhuma das verificações passar, definir um timeout como fallback
    const timeoutId = setTimeout(() => {
      console.log("Timeout de segurança ativado para mostrar controles de camada.");
      setCanShowControls(true);
    }, 3000); // Reduzir timeout para 3 segundos
    
    // Verificar periodicamente se o mapa existe
    const intervalId = setInterval(() => {
      if (mapRef?.current && (allPatternsInitialized || isMapLoaded)) {
        console.log("Mapa detectado em verificação periódica");
        setCanShowControls(true);
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      }
    }, 500);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isMapLoaded, mapRef, activePatterns, allPatternsInitialized]); // Adicionar activePatterns para reagir a mudanças
  
  const handleToggleLayer = (patternType: PatternType) => {
    onTogglePattern(patternType);
    
    if (!mapRef?.current) {
      console.warn("Mapa ainda não está disponível. A atualização de dados será ignorada.");
      return;
    }
  };

  const getButtonIcon = (patternType: PatternType) => {
    switch (patternType) {
      case PatternType.BIOMA:
      case PatternType.ESTADO:
        return <Map size={18} />;
      case PatternType.HEAT_MAP:
        return <Flame size={18} color="#E5E7EB" />;
      case PatternType.QUEIMADA:
        return <MapIcon size={18} color="#E5E7EB" />;
      case PatternType.RISCO_FOGO:
        return <AlertTriangle size={18} color="#E5E7EB" />;
      default:
        return <Layers size={18} />;
    }
  };
  
  // Define layer groups for better organization
  const baseLayers = [PatternType.BIOMA, PatternType.ESTADO];
  const dataLayers = [PatternType.HEAT_MAP, PatternType.QUEIMADA, PatternType.RISCO_FOGO];
  
  return (
    <LayerContainer>
      <LayerHeader>
        <Layers size={14} />
        Camadas
      </LayerHeader>
      
      {!canShowControls ? (
        <LoadingContainer>
          <Loader size={18} className="animate-spin" />
          <LoadingText>Carregando mapa...</LoadingText>
        </LoadingContainer>
      ) : (
        <>
          {/* Base Layers */}
          {baseLayers.map((patternType) => {
            const pattern = patterns[patternType];
            const isActive = activePatterns.includes(patternType);
            
            return (
              <LayerButton 
                key={pattern.id}
                $isActive={isActive}
                onClick={() => handleToggleLayer(patternType)}
                title={pattern.description}
              >
                <ButtonIcon>
                  {getButtonIcon(patternType)}
                </ButtonIcon>
                <ButtonLabel>{pattern.name}</ButtonLabel>
              </LayerButton>
            );
          })}
          
          <GroupDivider />
          
          {/* Data Layers */}
          {dataLayers.map((patternType) => {
            const pattern = patterns[patternType];
            const isActive = activePatterns.includes(patternType);
            
            return (
              <LayerButton 
                key={pattern.id}
                $isActive={isActive}
                onClick={() => handleToggleLayer(patternType)}
                title={pattern.description}
              >
                <ButtonIcon>
                  {getButtonIcon(patternType)}
                </ButtonIcon>
                <ButtonLabel>{pattern.name}</ButtonLabel>
              </LayerButton>
            );
          })}
        </>
      )}
    </LayerContainer>
  );
};

export default LayersNavigation;