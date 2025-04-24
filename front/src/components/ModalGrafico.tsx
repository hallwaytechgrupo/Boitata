import type { ModalProps } from "../types";
import "../styles/ModalEstado.css";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import '../styles/ModalGrafico.css'
import Modal from "./Modal";


const data = [
  { name: "Janeiro", focos: 400 },
  { name: "Fevereiro", focos: 300 },
  { name: "Março", focos: 200 },
  { name: "Abril", focos: 278 },
  { name: "Maio", focos: 189 },
  { name: "Junho", focos: 239 },
  { name: "Julho", focos: 349 },
];


const ModalGrafico: React.FC<ModalProps> = ({ title, onClose, onConfirm }) => {
  return (
    <Modal title={title} onClose={onClose} onConfirm={onConfirm}>
      <div className="modal-estado-content">
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="focos" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
    </Modal>
  );
};

export default ModalGrafico;