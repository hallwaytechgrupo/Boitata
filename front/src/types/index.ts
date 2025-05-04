export interface ModalProps {
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

export enum ModalType {
  FOCOS = 'focos',
  RISCO = 'risco',
  AREA = 'area',
  GRAFICOS = 'graficos',
  FILTROS = 'filtros',
  ANALISES = 'analises',
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
