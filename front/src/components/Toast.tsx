import type React from "react";
import { useEffect } from "react";
import "../styles/Toast.css"

interface ToastProps {
  message: string;
  duration?: number; // Duração em milissegundos (padrão: 3000ms)
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
  }, [duration, onClose]);

  return (
    <div className="toast-overlay">
      <div className="toast-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;