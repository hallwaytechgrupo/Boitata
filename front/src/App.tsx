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
import { getDadosAreaQueimada } from "./services/api";
import mapboxgl from "mapbox-gl";
import { VscGraph } from "react-icons/vsc";

// Componente interno que usa o contexto de modais
const AppContent = () => {
  const { estado, filterType } = useFilter();
  const {
    mapContainerRef,
    isMapLoaded,
    mapError,
    flyToState,
    resetMapView,
    activeLayers,
    toggleLayerVisibility,
    mapRef
  } = useMap();

  const [activeLayer, setActiveLayer] = useState<string | null>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [areaQueimadaData, setAreaQueimadaData] = useState<GeoJSON.FeatureCollection | null>(null);
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

    // Carregar dados de área queimada quando o mapa estiver carregado
    useEffect(() => {
      const carregarAreaQueimada = async () => {
        try {
          const data = await getDadosAreaQueimada();
          setAreaQueimadaData(data);
          console.log('Dados de área queimada carregados:', data);


        } catch (error) {
          console.error('Erro ao carregar área queimada:', error);
        }
      };

      if (isMapLoaded) {
        carregarAreaQueimada();
      }
    }, [isMapLoaded]);

    // Adicionar/atualizar camada de área queimada no mapa
    useEffect(() => {
      console.log('Entrei no useEffect de área queimada', areaQueimadaData);
      const map = mapRef?.current;
      if (map && areaQueimadaData) {
        if (map.getSource('area-queimada-source')) {
          (map.getSource('area-queimada-source') as mapboxgl.GeoJSONSource).setData(areaQueimadaData);
        } else {
          map.addSource('area-queimada-source', {
            type: 'geojson',
            data: areaQueimadaData,
          });

          map.addLayer({
            id: 'area-queimada-fill',
            type: 'fill',
            source: 'area-queimada-source',
            paint: {
              'fill-color': '#FFA07A',
              'fill-opacity': 0.6,
              'fill-outline-color': '#FF4500'
            }
          });

          map.on("click", "area-queimada-fill", (e: any) => {
            if (e.features && e.features.length > 0) {
              const properties = e.features[0].properties;
              new mapboxgl.Popup()
                .setLngLat(e.lngLat as mapboxgl.LngLatLike)
                .setHTML(`
                <strong>Área:</strong> ${properties?.areaKm2?.toFixed(2) ?? 'N/A'} km²<br/>
                <strong>Data:</strong> ${properties?.dataQueimada ? new Date(properties.dataQueimada).toLocaleDateString() : 'N/A'}<br/>
                <strong>Severidade:</strong> ${properties?.nivelSeveridade ?? 'N/A'}
              `)
                .addTo(map);
            }
          });
        }
      }
    }, [mapRef, areaQueimadaData]);

    //Teste para bordas dos estados
    // Este é o useEffect que você deve ter para as BORDAS DOS ESTADOS
    // useEffect(() => {
    //   console.log('Entrei no useEffect de bordas dos estados');
    //   if (isMapLoaded && areaQueimadaData && mapRef.current) {
    //     const activeStateId = estado?.id; // Estado do useFilter para destaque
    //     const map = mapRef.current;
    //     if (map && areaQueimadaData) {
    //       if (map.getSource('bordas-estados-source')) {
    //         (map.getSource('area-queimada-source') as mapboxgl.GeoJSONSource).setData(areaQueimadaData);
    //       } else {
    //         map.addSource('bordas-estados-source', {
    //           type: 'geojson',
    //           data: areaQueimadaData,
    //         });

    //         map.addLayer({
    //           id: 'bordas-estados-line',
    //           type: 'fill',
    //           source: 'bordas-estados-source',
    //           paint: {
    //             'line-color': [
    //               'case',
    //               ['==', ['get', 'id'], activeStateId],
    //               '#FFD700', // Destaque: Dourado
    //               '#000000'  // Padrão: Preto
    //             ],
    //             'line-width': [
    //               'case',
    //               ['==', ['get', 'id'], activeStateId],
    //               3,     // Destaque: Mais grossa
    //               1.5    // Padrão: Normal
    //             ],
    //             'line-opacity': 1
    //           },
    //           layout: {
    //             'visibility': 'visible'
    //           }
    //         });

    //         map.on("click", "bordas-estados-line", (e: any) => {
    //           if (e.features && e.features.length > 0) {
    //             const properties = e.features[0].properties;
    //             new mapboxgl.Popup()
    //               .setLngLat(e.lngLat as mapboxgl.LngLatLike)
    //               .setHTML(`
    //                             <strong>Estado:</strong> ${properties?.nome ?? 'N/A'}<br/>
    //                             <strong>ID:</strong> ${properties?.id ?? 'N/A'}
    //                         `)
    //               .addTo(mapRef.current!);
    //           }
    //         });
    //       }
    //     }
    //     //     'bordas-estados-line', // ID ÚNICO para a camada de LINHA das bordas
    //     //     'bordas-estados-source', // ID ÚNICO para a fonte de dados das bordas
    //     //     areaQueimadaData, // Seus dados GeoJSON dos estados (Polígonos)
    //     //     {
    //     //         type: 'line', // <<< ESTE É O TIPO CORRETO PARA DESENHAR AS BORDAS
    //     //         paint: {
    //     //             'line-color': [
    //     //                 'case',
    //     //                 ['==', ['get', 'id'], activeStateId],
    //     //                 '#FFD700', // Destaque: Dourado
    //     //                 '#000000'  // Padrão: Preto
    //     //             ],
    //     //             'line-width': [
    //     //                 'case',
    //     //                 ['==', ['get', 'id'], activeStateId],
    //     //                 3,     // Destaque: Mais grossa
    //     //                 1.5    // Padrão: Normal
    //     //             ],
    //     //             'line-opacity': 1
    //     //         },
    //     //         layout: {
    //     //             'visibility': 'visible'
    //     //         }
    //     //     },
    //     //     (e) => { // Popup de clique para as bordas (opcional)
    //     //         if (e.features && e.features.length > 0) {
    //     //             const properties = e.features[0].properties;
    //     //             new mapboxgl.Popup()
    //     //                 .setLngLat(e.lngLat as mapboxgl.LngLatLike)
    //     //                 .setHTML(`
    //     //                     <strong>Estado:</strong> ${properties?.nome ?? 'N/A'}<br/>
    //     //                     <strong>ID:</strong> ${properties?.id ?? 'N/A'}
    //     //                 `)
    //     //                 .addTo(mapRef.current!);
    //     //         }
    //     //     }
    //     // );
    //   }
    // }, [isMapLoaded, areaQueimadaData, mapRef, estado]); // Dependências


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

      {/* Botão para abrir o modal de gráfico de área queimada */}
      <button
        type="button"
        className="search-button"
        onClick={() => openModal(ModalType.GRAFICO_AREA_QUEIMADA)}
      >
        <VscGraph />
        Área Queimada
      </button>

      <SideNavigation
        openModal={openModal}
        activeLayer={activeLayer}
      />
      <LayersNavigation
        activePatterns={activeLayers}
        onTogglePattern={toggleLayerVisibility}
      />

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
      {/* Modal para gráficos de área queimada */}
      {activeModal === ModalType.GRAFICO_AREA_QUEIMADA && (
        <GraficosModal
          title="Gráficos de Área Queimada"
          onClose={closeModal}
          dataType="areaQueimada"
        />
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

      {/* Adicione outros modais conforme necessário */
      }
    </>
  );
};


// Componente principal que providencia o contexto
function App() {
  const {
    flyToState,
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
