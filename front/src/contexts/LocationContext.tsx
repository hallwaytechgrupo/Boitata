import { createContext, useContext, useState } from 'react';

import { FilterType, type LocationType, type LocationTypeContextProps } from '../types';

const LocationContext = createContext<LocationTypeContextProps | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [estado, setEstado] = useState<LocationType | null>(null);
  const [cidade, setCidade] = useState<LocationType | null>(null);
  const [bioma, setBioma] = useState<LocationType | null>(null);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.NONE);


  const resetFilters = () => {
    setEstado(null);
    setCidade(null);
    setBioma(null);
    setFilterType(FilterType.NONE);
  }

  const hasActiveFilters = estado !== null || cidade !== null || bioma !== null || filterType !== FilterType.NONE

  return (
    <LocationContext.Provider
      value={{
        estado,
        cidade,
        bioma,
        filterType,
        setEstado,
        setCidade,
        setBioma,
        setFilterType,
        resetFilters,
        hasActiveFilters,
      }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationTypeContextProps => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};