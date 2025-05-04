"use client"

import { X, FlameIcon as Fire, Map, BarChart2, Filter, PieChart } from "lucide-react"
import type { ModalType } from "@/types"

interface SidebarProps {
  isOpen: boolean
  openModal: (modal: ModalType) => void
  closeSidebar: () => void
}

export default function Sidebar({ isOpen, openModal, closeSidebar }: SidebarProps) {
  const handleMenuItemClick = (modal: ModalType) => {
    openModal(modal)
    closeSidebar()
  }

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-64 bg-gray-800 bg-opacity-80 backdrop-blur-md transform transition-transform duration-300 ease-in-out z-20 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:hidden`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
          <span className="text-white text-xl font-bold">Boitata</span>
          <span className="text-green-500 ml-1 text-xl font-bold">INPE</span>
        </div>
        <button
          onClick={closeSidebar}
          className="md:hidden text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="py-4 px-2 space-y-2">
        <button
          onClick={() => handleMenuItemClick("focos")}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <Fire className="w-5 h-5 mr-3" />
          <span>Focos de Calor</span>
        </button>
        <button
          onClick={() => handleMenuItemClick("risco")}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <Map className="w-5 h-5 mr-3" />
          <span>Risco de Fogo</span>
        </button>
        <button
          onClick={() => handleMenuItemClick("area")}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <Map className="w-5 h-5 mr-3" />
          <span>Área Queimada</span>
        </button>
        <button
          onClick={() => handleMenuItemClick("graficos")}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <BarChart2 className="w-5 h-5 mr-3" />
          <span>Gráficos</span>
        </button>
        <button
          onClick={() => handleMenuItemClick("filtros")}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <Filter className="w-5 h-5 mr-3" />
          <span>Filtros</span>
        </button>
        <button
          onClick={() => handleMenuItemClick("analises")}
          className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <PieChart className="w-5 h-5 mr-3" />
          <span>Análises</span>
        </button>
      </div>
    </div>
  )
}
