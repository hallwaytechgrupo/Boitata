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
