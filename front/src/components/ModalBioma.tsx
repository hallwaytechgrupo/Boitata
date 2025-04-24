import { useLocation } from "../contexts/LocationContext";
import type { Location, ModalProps } from "../types";
import { biomas } from "../utils/biomes";
import SearchModal from "./SearchModal";
import "../styles/ModalEstado.css";
import Modal from "./Modal";

const ModalBioma: React.FC<ModalProps> = ({ title, onClose, onConfirm }) => {
  const { setBioma } = useLocation();

  const handleSelectBioma = (selectedBioma: Location) => {
    console.log("Bioma selecionado:", selectedBioma);
    setBioma(selectedBioma);
  };

  return (
    <Modal title={title} onClose={onClose} onConfirm={onConfirm}>
      <div className="modal-estado-content">
      <SearchModal options={biomas} onSelect={handleSelectBioma} />
      </div>
    </Modal>
  );
};

export default ModalBioma;