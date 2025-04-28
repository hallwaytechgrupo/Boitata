import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import "./App.css";
import ModalEstado from "./components/ModalEstado";
import { useLocation } from "./contexts/LocationContext";
import { getBiomasShp, getFocosByBioamId, getFocosCalorByEstadoId, getStateInfo } from "./services/api";
import { statesCoordinates } from "./utils/statesCoordinates";
import ModalBioma from "./components/ModalBioma";
import Toast from "./components/Toast";
import { FaGlobeAmericas } from "react-icons/fa";
import { RiLeafLine } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { GrInfo } from "react-icons/gr";
import { ModalType } from "./types/ModalEnum";
import ModalGrafico from "./components/ModalGrafico";
import { FilterType } from "./types/FilterEnum";
import type { Location } from "./types";
import ModalInfo from "./components/ModalInfo";

function App() {
	const { estado, bioma, filterType, setFilterType } = useLocation();

	const mapRef = useRef<mapboxgl.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement | null>(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<ModalType | null>(null);

	const [toastMessage, setToastMessage] = useState<string | null>(null);
	const [biomasVisible, setBiomasVisible] = useState(() => {
		const saved = localStorage.getItem('biomasVisible');
		return saved !== null ? JSON.parse(saved) : true;
	});

	const [focosCalor, setFocosCalor] = useState<
		GeoJSON.FeatureCollection<GeoJSON.Geometry>
	>({
		type: "FeatureCollection",
		features: [],
	});

	const [stateInfo, setStateInfo] = useState<any>(null);

	const toggleBiomasVisibility = () => {
		const isVisible = !biomasVisible;
		setBiomasVisible(isVisible);
		localStorage.setItem('biomasVisible', JSON.stringify(isVisible));

		
		if (mapRef.current?.getLayer('bioma-fill')) {
			mapRef.current.setLayoutProperty(
				'bioma-fill', 
				'visibility', 
				isVisible ? 'visible' : 'none'
			);
			
			mapRef.current.setLayoutProperty(
				'bioma-label', 
				'visibility', 
				isVisible ? 'visible' : 'none'
			);
		}
	};

	const showToast = (message: string) => {
		setToastMessage(message);
	};

	const handleOpenModal = (type: ModalType) => {
		setModalType(type);
		setIsModalOpen(true);
	};

	const handleConfirm = async () => {
		try {
			if (modalType === ModalType.Estado) {
				const estadoId = estado?.id.toString();

				if (!estadoId) {
					showToast("Estado não encontrado");
					console.error("Estado não encontrado");
					return;
				}

				const resultado = await getFocosCalorByEstadoId(estadoId);
				console.log("resultado:", resultado);

				// const stateInfo = await getStateInfo(estadoId);
				// console.log("stateInfo:", stateInfo);
				
				// Atualizar o estado do GeoJSON
				setFocosCalor(resultado);
				setStateInfo(stateInfo);

				// Ajustar o mapa para o estado selecionado
				if (estado && statesCoordinates[estado.id]) {
					const { latitude, longitude } = statesCoordinates[estado.id];
					mapRef.current?.flyTo({
						center: [longitude, latitude],
						zoom: 6, // Ajuste o nível de zoom para o estado
						essential: true,
					});
				}

				setFilterType(FilterType.Estado);
			} else if (modalType === ModalType.Bioma) {
				// Lógica para buscar dados de biomas
				const biomaId = bioma?.id.toString();

				if (!biomaId) {
					showToast("Bioma não encontrado");
					console.error("Bioma não encontrado");
					return;
				}

				const resultado = await getFocosByBioamId(biomaId);
				console.log("resultado:", resultado);
				
				// Atualizar o estado do GeoJSON
				setFocosCalor(resultado);
				
				setFilterType(FilterType.Bioma);

			} else if (modalType === ModalType.Info) {
				const estadoId = estado?.id.toString();

				if (!estadoId) {
					showToast("Estado não encontrado");
					console.error("Estado não encontrado");
					return;
				}
			}

			// Fechar o modal
			setIsModalOpen(false);
		} catch (error) {
			console.error("Erro ao buscar dados:", error);
		}
	};

	const resetMapToBrazil = () => {
		mapRef.current?.flyTo({
			center: [-55.491477, -13.720512],
			zoom: 3.5,
			essential: true,
		});
	};

	const carregarBioma = async () => {
		try {
			const geojson = await getBiomasShp();
	
			// Verifica se já existe a fonte
			if (mapRef.current?.getSource('bioma-layer')) {
				(mapRef.current.getSource('bioma-layer') as mapboxgl.GeoJSONSource).setData(geojson);
			} else {
				// Adiciona a fonte com persistência
				mapRef.current?.addSource('bioma-layer', {
					type: 'geojson',
					data: geojson,
					promoteId: 'id' // Garante IDs únicos para cada bioma
				});
	
				const biomaColors = {
					1: '#1E8449', // Amazônia - Verde escuro
					2: '#F39C12', // Caatinga - Laranja
					3: '#27AE60', // Cerrado - Verde
					4: '#2ECC71', // Mata Atlântica - Verde claro
					5: '#F1C40F', // Pampa - Amarelo
					6: '#3498DB'  // Pantanal - Azul
				};
	
				// Adiciona camada de preenchimento
				mapRef.current?.addLayer({
					id: "bioma-fill",
					type: "fill",
					source: "bioma-layer",
					layout: {
						visibility: biomasVisible ? 'visible' : 'none'
					},
					paint: {
						'fill-color': [
							'match',
							['get', 'id'],
							1, biomaColors[1],
							2, biomaColors[2],
							3, biomaColors[3],
							4, biomaColors[4],
							5, biomaColors[5],
							6, biomaColors[6],
							'#CCC'
						],
						'fill-opacity': 0.2,
						'fill-outline-color': '#000'
					}
				});
	
				// Adiciona camada de rótulos
				mapRef.current?.addLayer({
					id: "bioma-label",
					type: "symbol",
					source: "bioma-layer",
					layout: {
						"text-field": ["get", "nome_bioma"],
						"text-size": 12,
						"text-allow-overlap": true,
						visibility: biomasVisible ? 'visible' : 'none'
					},
					paint: {
						"text-color": "#000",
						"text-halo-color": "#fff",
						"text-halo-width": 2,
					},
				});
			}
		} catch (error) {
			console.error("Erro ao carregar os biomas:", error);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		mapboxgl.accessToken =
			"pk.eyJ1IjoiYm9pdGF0YSIsImEiOiJjbTlrZGF3ejgwb2FxMnJvYWZ1Z3pudndpIn0.EiV7WmRDDZZBkY2A0PSJ1A";
		mapRef.current = new mapboxgl.Map({
			container:
				mapContainerRef.current ??
				(() => {
					throw new Error("Map container is not available");
				})(),
			style: "mapbox://styles/mapbox/dark-v11",
			center: [-55.491477, -13.720512],
			zoom: 4,
			attributionControl: false,
			logoPosition: "top-right",
		});

		mapRef.current.on("load", () => {
			mapRef.current?.addSource("geojson-data", {
				type: "geojson",
				data: focosCalor, // Inicialmente vazio
			});

			// mapRef.current?.on("click", handleMapClick);

			mapRef.current?.addLayer({
				id: "frp-heatmap",
				type: "heatmap",
				source: "geojson-data",
				paint: {
					"heatmap-weight": [
						"interpolate",
						["linear"],
						["get", "frp"],
						0,
						0,
						50,
						0.5,
						100,
						1,
					],
					"heatmap-radius": [
						"interpolate",
						["linear"],
						["zoom"],
						5,
						10,
						9,
						20,
						12,
						25,
					],
					"heatmap-opacity": [
						"interpolate",
						["linear"],
						["zoom"],
						5,
						0.8,
						10,
						0.6,
					],
					"heatmap-color": [
						"interpolate",
						["linear"],
						["heatmap-density"],
						0,
						"rgba(33, 102, 172, 0)",
						0.1,
						"rgb(103, 169, 207)",
						0.3,
						"rgb(209, 229, 240)",
						0.5,
						"rgb(253, 219, 199)",
						0.7,
						"rgb(239, 138, 98)",
						0.9,
						"rgb(178, 24, 43)",
					],
				},
			});

			// Adicionar o evento de clique no heatmap
			mapRef.current?.on("click", "frp-heatmap", (e) => {
				if (e.features && e.features.length > 0) {
					const properties = e.features[0].properties;

					console.log("Propriedades do ponto:", properties);

					new mapboxgl.Popup({ closeOnClick: true }) // Alterado para closeOnClick: true
						.setLngLat(e.lngLat)
						.setHTML(`
        <strong>FRP:</strong> ${properties?.frp ?? 0}<br/>
        <strong>Data:</strong> ${properties?.data ?? 0}<br/>
        <strong>Risco:</strong> ${properties?.risco ?? 0}<br/>
        <strong>Satélite:</strong> ${properties?.satelite ?? 0}<br/>
        <strong>Município:</strong> ${properties?.municipio ?? 0}
      `)
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						.addTo(mapRef.current!);
				}
			});

			carregarBioma();

		});

		return () => {
			mapRef.current?.remove();
		};
	}, []); // Executa apenas uma vez, ao montar o componente

	useEffect(() => {
		if (mapRef.current) {
			// Evento de clique nos biomas
			mapRef.current.on('click', 'bioma-fill', (e) => {
				if (e.features && e.features.length > 0) {
					const bioma = e.features[0].properties as Location | null;
					if (!bioma) {
						console.error("Bioma properties are null");
						return;
					}
					new mapboxgl.Popup()
						.setLngLat(e.lngLat)
						.setHTML(`
							<h3>${bioma.nome}</h3>
							<p>ID: ${bioma.id}</p>
						`)
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						.addTo(mapRef.current!);
				}
			});
	
			// Muda o cursor ao passar sobre biomas
			mapRef.current.on('mouseenter', 'bioma-fill', () => {
				if (mapRef.current) {
					mapRef.current.getCanvas().style.cursor = 'pointer';
				}
			});
	
			mapRef.current.on('mouseleave', 'bioma-fill', () => {
				if (mapRef.current) {
					mapRef.current.getCanvas().style.cursor = '';
				}
			});
		}
	
		return () => {
			if (mapRef.current) {
				mapRef.current.off('click', 'bioma-fill');
				mapRef.current.off('mouseenter', 'bioma-fill');
				mapRef.current.off('mouseleave', 'bioma-fill');
			}
		};
	}, []);

	useEffect(() => {
		if (estado && statesCoordinates[estado.id]) {
			const { latitude, longitude } = statesCoordinates[estado.id];

			// Ajustar o mapa para o estado selecionado
			mapRef.current?.flyTo({
				center: [longitude, latitude],
				zoom: 6, // Ajuste o nível de zoom para o estado
				essential: true,
			});
		}
	}, [estado]);

	// Atualizar os dados da fonte 'geojson-data' quando focosCalor mudar
	useEffect(() => {
		if (mapRef.current?.getSource("geojson-data")) {
			(
				mapRef.current.getSource("geojson-data") as mapboxgl.GeoJSONSource
			).setData(focosCalor);
		}
	}, [focosCalor]); // Atualiza apenas quando focosCalor mudar

	return (
		<>
			<div id="map-container" ref={mapContainerRef} />

			{toastMessage && (
				<Toast message={toastMessage} onClose={() => setToastMessage(null)} />
			)}

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div className="top-container" onClick={resetMapToBrazil}>
				<p>Boitata Sentinel</p>
			</div>

			<div className="filter-container">
				<div className="category">
					<p className="filter-container-title">Filtrar por</p>
					<button
						type="button"
						className="search-button"
						onClick={() => handleOpenModal(ModalType.Estado)}
					>
						<FaGlobeAmericas /> Estado
					</button>

					<button
						type="button"
						className="search-button"
						onClick={() => handleOpenModal(ModalType.Bioma)}
					>
						<RiLeafLine /> Bioma
					</button>
				</div>
			</div>

			<div className="filter-container-right">
				<div className="category">
					{/* <p className="filter-container-title">Overlay</p>
					<button
						type="button"
						className="search-button"
						onClick={() => handleOpenModal(ModalType.Estado)}
					>
						<FaGlobeAmericas /> Estado
					</button> */}

					{/* <button
						type="button"
						className="search-button"
						onClick={() => handleOpenModal(ModalType.Bioma)}
					>
						<RiLeafLine />
					</button> */}

<button
    type="button"
    className="search-button"
    onClick={toggleBiomasVisibility}
  >
    {biomasVisible ? (
      <RiLeafLine color="#27AE60" /> // Verde quando visível
    ) : (
      <RiLeafLine color="#888" />    // Cinza quando oculto
    )}
  </button>
				</div>
			</div>

			<div className="other-filter-container">
				<div className="category">
					<button
						type="button"
						className="search-button"
						onClick={() => handleOpenModal(ModalType.Info)}
					>
						<GrInfo />
					</button>

					<button
						type="button"
						className="search-button"
						onClick={() => handleOpenModal(ModalType.Grafico)}
					>
						<VscGraph />
					</button>
				</div>
				{/* <div className="category">
					<button
						type="button"
						className="search-button"
						onClick={() => console.log("Another action")}
					>
						<FaFire size={24} color="#ff4500" />
						<FaMapMarkerAlt
							size={12}
							color="#ff4500"
							className="absolute -bottom-1 -right-1"
						/>
					</button>

					<button
						type="button"
						className="search-button"
						onClick={() => console.log("Another action 2")}
					>
						<FaBurn size={24} color="#8b0000" />
						<FaTree
							size={12}
							color="#8b0000"
							className="absolute -bottom-1 -right-1"
						/>
					</button>

					<button
						type="button"
						className="search-button"
						onClick={() => console.log("Another action 2")}
					>
						<FaExclamationTriangle size={24} color="#ffa500" />
						<FaFire
							size={12}
							color="#ffa500"
							className="absolute -bottom-1 -right-1"
						/>
					</button>
				</div> */}
			</div>

			{isModalOpen && (
				<>
					{modalType === ModalType.Estado && (
						<ModalEstado
							title="Estado"
							onClose={() => {
								setIsModalOpen(false);
								resetMapToBrazil();
							}}
							onConfirm={handleConfirm}
						/>
					)}

					{modalType === ModalType.Bioma && (
						<ModalBioma
							title="Bioma"
							onClose={() => {
								setIsModalOpen(false);
								resetMapToBrazil();
							}}
							onConfirm={() => {
								handleConfirm();
							}}
						/>
					)}

					{modalType === ModalType.Info && (
						<ModalInfo
							title="Informações"
							onClose={() => setIsModalOpen(false)}
							stateInfo={stateInfo}
						/>
					)}

					{modalType === ModalType.Grafico && (
						<ModalGrafico
							title={`Gráfico por ${filterType} - Focos de Calor`}
							onClose={() => setIsModalOpen(false)}
						/>
					)}
				</>
			)}
		</>
	);
}

export default App;
