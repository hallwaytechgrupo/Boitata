import type {  ModalProps } from "../types";
import "../styles/ModalEstado.css";
import "../styles/ModalInfo.css";
import Modal from "./Modal";

const ModalInfo: React.FC<ModalProps> = ({ title, onClose, onConfirm }) => {
  return (
    <Modal title={title} onClose={onClose} onConfirm={onConfirm}>
      <div className="modal-estado-content">
        <div>
          <div className="card-info">
          <p><strong>ID do Estado:</strong> 35</p>
          <p><strong>Estado:</strong> São Paulo</p>
          <p><strong>Total de Municípios:</strong> 645</p>
          </div>
          <div className="card-info">
          <h4>Top Cidades</h4>
          <ul>
            <li>São Paulo - Total de Focos: 125</li>
            <li>Campinas - Total de Focos: 89</li>
            <li>Ribeirão Preto - Total de Focos: 76</li>
            <li>Sorocaba - Total de Focos: 65</li>
            <li>Santos - Total de Focos: 54</li>
          </ul>
          </div>
          <div className="card-info">
          <h4>Maior FRP</h4>
          <p><strong>Município:</strong> Presidente Prudente</p>
          <p><strong>FRP:</strong> 98.7</p>
          <p><strong>Data:</strong> 15/11/2023 14:30</p>
          </div>
          <h4>Última Atualização</h4>
          <p>20/11/2023 09:45</p>
        </div>
      </div>
    </Modal>
  );
};

export default ModalInfo;