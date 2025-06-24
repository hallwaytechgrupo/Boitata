import "../../styles/SearchModal.css";
import type { LocationType } from '../../types';
import SearchDataOptions from "./SearchDataOptions";

interface SearchModalProps {
  options: LocationType[]; // (estados ou biomas)
  onSelect: (item: LocationType) => void; // Callback para o item selecionado
}

export default function SearchModal({ options, onSelect }: SearchModalProps) {
  return (
    <div className="search-modal">
      <div id="dataFilter">
        <label htmlFor="inputOptions">Opção:</label>
        <input
          list="options"
          id="inputStates"
          placeholder="Escolha uma opção"
          onChange={(event) => {
            const selectedNome = event.target.value; // Captura o nome do item
            const selectedItem = options.find((item) => item.nome === selectedNome); // Encontra o item correspondente
            if (selectedItem) {
              onSelect(selectedItem); // Chama a função passada como prop
            }
          }}
        />
        <datalist id="options">
          {options.map((item) => (
            <option key={item.id} value={item.nome}>
              {item.id} - {item.nome}
            </option>
          ))}
        </datalist>
      </div>
      <SearchDataOptions />
    </div>
  );
}