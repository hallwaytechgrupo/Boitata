import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import SideNavigation from "./components/menu/SideNavigation";
import LayersNavigation from "./components/menu/LayerSelection";
import BoitataLogo from "./components/menu/BoitataLogo";
import ModalFocos from './components/modal/focos-de-calor/ModalFocos';
import FilterBadge from "./components/badge/FilterBadge";
import { useMap } from "./hooks/useMap";
import { ModalProvider, useModal } from "./contexts/ModalContext";
import ModalAnalises from './components/modal/analises/ModalAnalises';
import ModalAreaQueimada from './components/modal/area-queimada/ModalAreaQueimada';
import ModalFiltro from './components/modal/filtros/ModalFiltro';
import ModalRisco from './components/modal/risco-de-fogo/ModalRisco';
import GraficosModal from './components/modal/graficos/ModalGraficos';
import { ActiveFilter } from './components/menu/ActiveFilter';
import { useFilter } from './contexts/FilterContext';
import { FilterType, ModalType, PatternType } from './types';
import Toast from './components/search/Toast';


// Componente interno que usa o contexto de modais
const AppContent = () => {
  const { estado, bioma, filterType } = useFilter();
  const { 
    mapContainerRef, 
    isMapLoaded, 
    mapError, 
    flyToState, 
    flyToBioma,
    resetMapView,
    activeLayers,
    toggleLayerVisibility,
  } = useMap();
  
  const [activeLayer, setActiveLayer] = useState<string | null>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const { activeModal, closeModal, openModal } = useModal();

  const handleLayerChange = (layer: string) => {
    console.log("Alterando camada para:", layer);
    setActiveLayer(layer);
    
    // Mapeamento de layers para patterns
    const layerToPattern = {
      "focos": PatternType.HEAT_MAP,
      "bioma": PatternType.BIOMA,
      "queimada": PatternType.QUEIMADA,
      "risco": PatternType.RISCO_FOGO
    };
    
    // Alternar a visibilidade da layer correspondente
    const patternType = layerToPattern[layer as keyof typeof layerToPattern];
    if (patternType && !activeLayers.includes(patternType)) {
      toggleLayerVisibility(patternType);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  // Effect to adjust map when state changes
  useEffect(() => {
    if (estado && isMapLoaded && filterType === FilterType?.ESTADO) {
      flyToState(estado.id);
    }
    if (bioma && isMapLoaded && filterType === FilterType?.BIOMA) {
      flyToBioma(bioma.id);
    }
  }, [estado, isMapLoaded, flyToState, filterType]);

  // Show error message if map fails to load
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    if (mapError) {
      showToast(mapError);
    }
  }, [mapError]);

  return (
    <>
      <div id="map-container" ref={mapContainerRef} />

      <ActiveFilter />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <BoitataLogo />
      {/* <FilterBadge /> */}
      <SideNavigation 
        openModal={openModal} 
        activeLayer={activeLayer} 
        // onLayerChange={handleLayerChange}
      />
      <LayersNavigation 
        activePatterns={activeLayers}
        onTogglePattern={toggleLayerVisibility}
      />

      {/*
        1. FILTROS = 'filtros',
        2. GRAFICOS = 'graficos',
        3. ANALISES = 'analises',
        4. AREA = 'area',
        5. FOCOS = 'focos',
        6. RISCO = 'risco',
        4. ESTADO = 'estado',
        3. BIOMA = 'bioma',
      */}

      {/* Renderização condicional dos modais baseada no activeModal */}
      {activeModal === ModalType.FILTROS && (
        <ModalFiltro onClose={closeModal} />
      )}
      {activeModal === ModalType.ANALISES && (
        <ModalAnalises onClose={closeModal} />
      )}
      {activeModal === ModalType.GRAFICOS && (
        <GraficosModal onClose={closeModal} />
      )}
      {activeModal === ModalType.ANALISES && (
        <ModalAnalises onClose={closeModal} />
      )}
      {activeModal === ModalType.AREA && (
        <ModalAreaQueimada onClose={closeModal} />
      )}
      {activeModal === ModalType.RISCO && (
        <ModalRisco onClose={closeModal} />
      )}
      {activeModal === ModalType.FOCOS && (
        <ModalFocos onClose={closeModal} />
      )}

      {/* Adicione outros modais conforme necessário */}
    </>
  );
};

// Componente principal que providencia o contexto
function App() {
  const { 
    flyToState,
    flyToBioma,
    activeLayers,
    toggleLayerVisibility,
    updateLayerData
  } = useMap();
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <ModalProvider 
      updateLayerData={updateLayerData}
      toggleLayerVisibility={toggleLayerVisibility}
      activeLayers={activeLayers}
      flyToState={flyToState}
      flyToBioma={flyToBioma}
      showToast={showToast}
    >
      <AppContent />
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </ModalProvider>
  );
}

export default App;
