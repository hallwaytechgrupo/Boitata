"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

const ToastContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
  width: 100%;
`

const ToastItem = styled(motion.div)<{ $type: string }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(8px);
  color: #E5E7EB;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${({ $type }) => {
    switch ($type) {
      case "success":
        return "#10B981"
      case "error":
        return "#EF4444"
      case "warning":
        return "#F59E0B"
      case "info":
        return "#3B82F6"
      default:
        return "#10B981"
    }
  }};
`

const IconContainer = styled.div<{ $type: string }>`
  margin-right: 12px;
  color: ${({ $type }) => {
    switch ($type) {
      case "success":
        return "#10B981"
      case "error":
        return "#EF4444"
      case "warning":
        return "#F59E0B"
      case "info":
        return "#3B82F6"
      default:
        return "#10B981"
    }
  }};
`

const ToastContent = styled.div`
  flex: 1;
`

const ToastTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 4px;
`

const ToastMessage = styled.p`
  font-size: 0.75rem;
  opacity: 0.8;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  
  &:hover {
    color: #E5E7EB;
  }
  
  &:focus {
    outline: none;
  }
`

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

const Toast = ({ id, type, title, message, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => {
      clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} />
      case "error":
        return <AlertCircle size={18} />
      case "warning":
        return <AlertTriangle size={18} />
      case "info":
        return <Info size={18} />
      default:
        return <CheckCircle size={18} />
    }
  }

  return (
    <ToastItem
      $type={type}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      layout
    >
      <IconContainer $type={type}>{getIcon()}</IconContainer>
      <ToastContent>
        <ToastTitle>{title}</ToastTitle>
        <ToastMessage>{message}</ToastMessage>
      </ToastContent>
      <CloseButton onClick={() => onClose(id)} aria-label="Fechar notificação">
        <X size={16} />
      </CloseButton>
    </ToastItem>
  )
}

// Componente para gerenciar múltiplos toasts
export const ToastManager = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id, onClose: removeToast }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Expor o método addToast globalmente
  useEffect(() => {
    ;(window as any).showToast = addToast

    return () => {
      delete (window as any).showToast
    }
  }, [])

  return (
    <ToastContainer>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </ToastContainer>
  )
}

export default Toast
