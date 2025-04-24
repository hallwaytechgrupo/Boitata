import Modal from './Modal';
import '../styles/ModalEstado.css';
import SearchModal from './SearchModal';
import type { ModalProps } from '../types/modalProps';


const ModalEstado: React.FC<ModalProps> = ({ onClose, onConfirm }) => {
  console.log("ModalEstado renderizado");
  return (
    <Modal title="Selecione um Estado" onClose={onClose} onConfirm={onConfirm}>
      <div className="modal-estado-content">
        <SearchModal />
      </div>
    </Modal>
  );
};

export default ModalEstado;