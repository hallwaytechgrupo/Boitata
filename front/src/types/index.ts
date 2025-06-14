export interface ModalProps {
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

export enum ModalType {
  ANALISES = 'analises',
  AREA = 'area',
  BIOMA = 'bioma',
  ESTADO = 'estado',
  FILTROS = 'filtros',
  FOCOS = 'focos',
  GRAFICOS = 'graficos',
  RISCO = 'risco',
  GRAFICO_AREA_QUEIMADA = 'graficoAreaQueimada',
  GRAFICO_RISCO = 'graficoRisco',
}

export enum FilterType {
  NONE = 'none',
  ESTADO = 'estado',
  MUNICIPIO = 'municipio',
  BIOMA = 'bioma',
}

export interface LocationType {
  id: number;
  nome: string;
}

export interface LocationTypeContextProps {
  estado: LocationType | null;
  cidade: LocationType | null;
  bioma: LocationType | null;
  filterType: FilterType;
  setEstado: (estado: LocationType) => void;
  setCidade: (cidade: LocationType) => void;
  setBioma: (bioma: LocationType) => void;
  setFilterType: (type: FilterType) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

export interface MapPattern {
  id: string;
  name: string;
  description: string;
  initialized?: boolean;
  initialize: (map: mapboxgl.Map) => Promise<void>;
  update: (map: mapboxgl.Map, data: any) => void;
  setVisibility: (map: mapboxgl.Map, visible: boolean) => void;
  cleanup: (map: mapboxgl.Map) => void;
}

export enum PatternType {
  HEAT_MAP = 'heatmap',
  BIOMA = 'bioma',
  QUEIMADA = 'queimada',
  RISCO_FOGO = 'risco-fogo',
  ESTADO = 'estado',
}

export const patterns = {
  [PatternType.HEAT_MAP]: {
    id: 'heatmap',
    name: 'Focos de Calor',
    description: 'Visualização de focos de calor no formato de mapa de calor',
  },
  [PatternType.BIOMA]: {
    id: 'bioma',
    name: 'Biomas',
    description: 'Visualização de biomas brasileiros',
  },
  [PatternType.ESTADO]: {
    id: 'estado',
    name: 'Estados',
    description: 'Visualização de estados brasileiros',
  },

  [PatternType.QUEIMADA]: {
    id: 'queimada',
    name: 'Áreas Queimadas',
    description: 'Visualização de áreas queimadas',
  },
  [PatternType.RISCO_FOGO]: {
    id: 'risco-fogo',
    name: 'Risco de Fogo',
    description: 'Visualização de áreas com risco de fogo',
  },
};
