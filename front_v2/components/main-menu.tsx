"use client"

import { useState } from "react"
import { Menu, X, FlameIcon as Fire, Map, BarChart2, Filter, PieChart } from "lucide-react"
import type { ModalType } from "@/types"

interface MainMenuProps {
  openModal: (modal: ModalType) => void
  toggleSidebar: () => void
}

export default function MainMenu({ openModal, toggleSidebar }: MainMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleMenuItemClick = (modal: ModalType) => {
    openModal(modal)
    if (mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Menu principal fixo no topo */}
      <nav className="fixed top-0 left-0 right-0 z-10 bg-gray-800 bg-opacity-80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e título */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-xl font-bold">Boitata</span>
                <span className="text-green-500 ml-1 text-xl font-bold">INPE</span>
              </div>
              <div className="hidden md:block ml-4 text-sm text-gray-300">Programa Queimadas</div>
            </div>

            {/* Menu para desktop */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-4">
                <button
                  onClick={() => handleMenuItemClick("focos")}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Fire className="w-4 h-4 mr-1" />
                  Focos de Calor
                </button>
                <button
                  onClick={() => handleMenuItemClick("risco")}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center "
                >
                  <Map className="w-4 h-4 mr-1" />
                  Risco de Fogo
                </button>
                <button
                  onClick={() => handleMenuItemClick("area")}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Map className="w-4 h-4 mr-1" />
                  Área Queimada
                </button>
                <button
                  onClick={() => handleMenuItemClick("graficos")}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <BarChart2 className="w-4 h-4 mr-1" />
                  Gráficos
                </button>
                <button
                  onClick={() => handleMenuItemClick("filtros")}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Filtros
                </button>
                <button
                  onClick={() => handleMenuItemClick("analises")}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <PieChart className="w-4 h-4 mr-1" />
                  Análises
                </button>
              </div>
            </div>

            {/* Botão de menu mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Abrir menu principal</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-800 bg-opacity-90 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => handleMenuItemClick("focos")}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center"
              >
                <Fire className="w-5 h-5 mr-2" />
                Focos de Calor
              </button>
              <button
                onClick={() => handleMenuItemClick("risco")}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center"
              >
                <Map className="w-5 h-5 mr-2" />
                Risco de Fogo
              </button>
              <button
                onClick={() => handleMenuItemClick("area")}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center"
              >
                <Map className="w-5 h-5 mr-2" />
                Área Queimada
              </button>
              <button
                onClick={() => handleMenuItemClick("graficos")}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center"
              >
                <BarChart2 className="w-5 h-5 mr-2" />
                Gráficos
              </button>
              <button
                onClick={() => handleMenuItemClick("filtros")}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </button>
              <button
                onClick={() => handleMenuItemClick("analises")}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center"
              >
                <PieChart className="w-5 h-5 mr-2" />
                Análises
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
