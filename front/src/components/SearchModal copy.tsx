import { estados } from "../utils/states";
import SearchDataOptions from "./SearchDataOptions";
import "../styles/SearchModal.css";
import type { State } from "../types/types";

interface SearchModalProps {
  onSelectEstado: (estado: State) => void;
}

export default function SearchModal({ onSelectEstado }: SearchModalProps) {
  return (
    <div className="search-modal">
      {/* <h3>Filtro de busca:</h3> */}
      <div id="dataFilter">
        <label htmlFor="inputStates">Estado:</label>
        <input
          list="states"
          id="inputStates"
          placeholder="Escolha o estado"
          onChange={(event) => {
            const selectedNome = event.target.value; // Captura o nome do estado
            const selectedEstado = estados.find((estado) => estado.nome === selectedNome); // Encontra o estado correspondente
            if (selectedEstado) {
              onSelectEstado(selectedEstado); // Chama a função passada como prop
            }
          }}
        />
        <datalist id="states">
          {estados.map((estado) => (
            <option key={estado.id} value={estado.nome}>
              {estado.id} - {estado.nome}
            </option>
          ))}
        </datalist>
      </div>
      <SearchDataOptions />
    </div>
  );
}