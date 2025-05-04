import "../styles/Modal.css";
import "../styles/Toast.css"
import type { ModalProps } from "../types/types";

const Modal: React.FC<ModalProps> = ({
	title,
	onClose,
	onConfirm,
	children,
}) => {

	console.log("Modal renderizado");
  
	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<h2 className="modal-title">{title}</h2>
				{children}
				<div className="modal-buttons">
					<button type="button" className="close-button" onClick={onClose}>
						Fechar
					</button>
					{onConfirm && (
						<button
							type="button"
							className="confirm-button"
							onClick={onConfirm}
						>
							Confirmar
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Modal;
