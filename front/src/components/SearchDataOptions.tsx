import { useState } from "react";
import '../styles/SearchDataOptions.css'

const SearchDataOptions = () => {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const opcoes = [
    { id: "focos_de_calor", label: "Focos de Calor" },
    { id: "area_queimada", label: "Área Queimada" },
    { id: "risco_de_incendio", label: "Risco de Incêndio" },
  ];

  const handleChange = (id: string) => {
    setSelecionado(selecionado === id ? null : id);
  };

  return (
    <div className="search-data-options">
      {opcoes.map((opcao) => (
        <div key={opcao.id}>
          <input
            type="checkbox"
            id={opcao.id}
            checked={selecionado === opcao.id}
            onChange={() => handleChange(opcao.id)}
          />
          <label htmlFor={opcao.id}>{opcao.label}</label>
        </div>
      ))}
    </div>
  );
};

export default SearchDataOptions;