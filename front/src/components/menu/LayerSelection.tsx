import type React from 'react';
import { useState, useEffect } from 'react';
// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { Layers, Flame, AlertTriangle, MapIcon, Loader, Map } from 'lucide-react';
import { useMap } from '../../hooks/useMap';
import { 
  mockFocosCalor, 
  mockBiomas, 
  mockAreasQueimadas, 
  mockRiscoFogo 
} from '../../utils/mockData';
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
    console.log("Verificando se o mapa está carregado...", allPatternsInitialized);
    // Verificar se o mapa está carregado usando isMapLoaded
    if (isMapLoaded) {
      setCanShowControls(true);
      return;
    }
    
    // Verificação alternativa - mapRef.current existe?
    if (mapRef?.current) {
      setCanShowControls(true);
      return;
    }
    
    // Se nenhuma das verificações passar, definir um timeout como fallback
    const timeoutId = setTimeout(() => {
      console.log("Timeout de segurança ativado para mostrar controles de camada.");
      setCanShowControls(true);
    }, 5000); // 5 segundos de timeout
    
    // Verificar periodicamente se o mapa existe
    const intervalId = setInterval(() => {
      if (mapRef?.current) {
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
  }, [isMapLoaded, mapRef]);
  
  const handleToggleLayer = (patternType: PatternType) => {
    onTogglePattern(patternType);
    
    // Verificar se mapRef.current existe antes de atualizar os dados
    if (!mapRef?.current) {
      console.warn("Mapa ainda não está disponível. A atualização de dados será ignorada.");
      return;
    }
    
    if (!activePatterns.includes(patternType)) {
      console.log(`Carregando dados mock para ${patternType}...`);
      switch(patternType) {
        // case PatternType.ESTADO:
        // // Add estado data when available
        // break;
        // case PatternType.BIOMA:
        //   updateLayerData(PatternType.BIOMA, mockBiomas);
        //   break;
        
        // case PatternType.HEAT_MAP:
        //   updateLayerData(PatternType.HEAT_MAP, mockFocosCalor);
        //   break;
        // case PatternType.QUEIMADA:
        //   updateLayerData(PatternType.QUEIMADA, mockAreasQueimadas);
        //   break;
        // case PatternType.RISCO_FOGO:
        //   updateLayerData(PatternType.RISCO_FOGO, mockRiscoFogo);
        //   break;
        
      }
    }
  };

  const getButtonIcon = (patternType: PatternType) => {
    switch (patternType) {
      case PatternType.BIOMA:
      case PatternType.ESTADO:
        return <Map size={18} />;
      case PatternType.HEAT_MAP:
        return <Flame size={18} color="#EF4444" />;
      case PatternType.QUEIMADA:
        return <MapIcon size={18} color="#15803D" />;
      case PatternType.RISCO_FOGO:
        return <AlertTriangle size={18} color="#FACC15" />;
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
      
      {!canShowControls && !allPatternsInitialized ? (
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