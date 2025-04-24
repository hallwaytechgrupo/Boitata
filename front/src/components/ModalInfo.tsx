import type { ModalProps } from "../types";
import Modal from "./Modal";
import "../styles/ModalEstado.css";
import "../styles/ModalInfo.css";

const ModalInfo: React.FC<ModalProps & { stateInfo: any }> = ({ title, onClose, onConfirm, stateInfo }) => {
  return (
    <Modal title={title} onClose={onClose} onConfirm={onConfirm}>
      <div className="modal-estado-content">
        {stateInfo ? (
          <div>
            {/* Informações gerais */}
            <div className="card-info">
              <p><strong>ID do Estado:</strong> {stateInfo.id_estado}</p>
              <p><strong>Estado:</strong> {stateInfo.estado}</p>
              <p><strong>Total de Municípios:</strong> {stateInfo.top_cidades.length}</p>
            </div>

            {/* Top Cidades */}
            <div className="card-info">
              <h4>Top Cidades</h4>
              <ul>
                {stateInfo.top_cidades.map((cidade: any, index: number) => (
                  <li key={index}>
                    {cidade.municipio} - Total de Focos: {cidade.total_focos}
                  </li>
                ))}
              </ul>
            </div>

            {/* Maior FRP */}
            <div className="card-info">
              <h4>Maior FRP</h4>
              <p><strong>Município:</strong> {stateInfo.maior_frp.municipio}</p>
              <p><strong>FRP:</strong> {stateInfo.maior_frp.frp}</p>
              <p><strong>Data:</strong> {new Date(stateInfo.maior_frp.data).toLocaleString()}</p>
            </div>

            {/* Última Atualização */}
            <h4>Última Atualização</h4>
            <p>{new Date(stateInfo.ultima_atualizacao).toLocaleString()}</p>
          </div>
        ) : (
          <p>As estatísticas são carregadas se e somente se um Estado estiver selecionado.</p>
        )}
      </div>
    </Modal>
  );
};

export default ModalInfo;