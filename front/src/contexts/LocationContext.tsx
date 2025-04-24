import { createContext, useContext, useState } from 'react';
import type { LocationContextProps, Location } from '../types';
import { FilterType } from '../types/FilterEnum';

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [estado, setEstado] = useState<Location | null>(null);
  const [cidade, setCidade] = useState<Location | null>(null);
  const [bioma, setBioma] = useState<Location | null>(null);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.Nenhum);

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
      }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextProps => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};