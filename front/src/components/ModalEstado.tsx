import Modal from './Modal';
import '../styles/ModalEstado.css';
import { useLocation } from '../contexts/LocationContext';
import SearchModal from './SearchModal';
import { estados } from '../utils/states';
import "../styles/ModalEstado.css"
import type { ModalProps } from '../types';

const ModalEstado: React.FC<ModalProps> = ({ onClose, onConfirm }) => {
  const { setEstado } = useLocation();
  
  const handleSelectEstado = (selectedEstado: { id: number; nome: string }) => {
    console.log("Estado selecionado:", selectedEstado);
    setEstado(selectedEstado); // Atualiza o estado no contexto
  };

  console.log("ModalEstado renderizado");
  return (
    <Modal title="Estado" onClose={onClose} onConfirm={onConfirm}>
      <div className="modal-estado-content">
        {/* <SearchModal onSelectEstado={handleSelectEstado} /> */}
        <SearchModal options={estados} onSelect={handleSelectEstado} />

      </div>
    </Modal>
  );
};

export default ModalEstado;