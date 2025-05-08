export interface ModalProps {
	title: string;
	onClose: () => void;
	onConfirm?: () => void;
	children?: React.ReactNode;
}

export interface State {
	id: number;
	nome: string;
}

export interface Location {
	id: number;
	nome: string;
}

export interface LocationContextProps {
	estado: Location | null;
	cidade: Location | null;
	bioma: Location | null;
	filterType: FilterType;
	setEstado: (estado: Location) => void;
	setCidade: (cidade: Location) => void;
	setBioma: (bioma: Location) => void;
	setFilterType: (type: FilterType) => void;
}


//tipo para o filtro
export enum FilterType {
	NONE = 'none',
	ESTADO = 'estado',
	MUNICIPIO = 'municipio',
	BIOMA = 'bioma',
}

//tipo para localidades
export interface LocationType {
	id: number;
	nome: string;
}

//tipo para exibição de dados
export enum PatternType {
	HEAT_MAP = 'heatmap',
	BIOMA = 'bioma',
	QUEIMADA = 'queimada',
	RISCO_FOGO = 'risco-fogo',
	ESTADO = 'estado',
  }