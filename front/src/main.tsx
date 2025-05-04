import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LocationProvider } from './contexts/LocationContext.tsx'
import { FilterProvider } from './contexts/FilterContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FilterProvider>
    <LocationProvider>
      <App />
    </LocationProvider>
    </FilterProvider>
  </StrictMode>,
)
