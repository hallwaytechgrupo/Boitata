import { useState } from "react";
import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import ModalBase from "../_base/ModalBase";
import { firesByStateData } from "../../../utils/mock";
import {
  Container,
  FilterGrid,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  ChartContainer,
  ChartTitle,
  ExportButton,
} from "./graficos-stylex";
import { getGraficoFocosCalor } from "../../../services/api";
import styled from "styled-components";
import { CiTextAlignCenter } from "react-icons/ci";

interface GraficosModalProps {
  onClose: () => void;
}

export const estadosSiglas: Record<number, string> = {
  11: "RO",
  12: "AC",
  13: "AM",
  14: "RR",
  15: "PA",
  16: "AP",
  17: "TO",
  21: "MA",
  22: "PI",
  23: "CE",
  24: "RN",
  25: "PB",
  26: "PE",
  27: "AL",
  28: "SE",
  29: "BA",
  31: "MG",
  32: "ES",
  33: "RJ",
  35: "SP",
  41: "PR",
  42: "SC",
  43: "RS",
  50: "MS",
  51: "MT",
  52: "GO",
  53: "DF",
};

export default function GraficosModal({ onClose }: GraficosModalProps) {
  const [month, setMonth] = useState("5"); // Default to January
  const [year, setYear] = useState("2025"); // Default to 2023
  const [chartData, setChartData] = useState(firesByStateData); // Use mock data initially
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tipo para os dados recebidos da API
  interface ApiFireData {
    ano: number;
    mes: number;
    id_estado: number;
    numero_focos_calor: number;
  }

  // Tipo para os dados formatados
  interface FormattedFireData {
    state: string;
    fires: number;
    risk?: number;
    area?: number;
  }

  const fetchData = async (selectedMonth: string, selectedYear: string) => {
    try {
      setLoading(true);
      setError(null);

      // Converter month e year para number
      const monthNum = Number.parseInt(selectedMonth, 10);
      const yearNum = Number.parseInt(selectedYear, 10);

      console.log("Buscando dados para:", { mês: monthNum, ano: yearNum });

      // Usar a função da API
      const responseData = await getGraficoFocosCalor(monthNum, yearNum);

      console.log("Dados recebidos:", responseData);

      // Transformar os dados da API no formato necessário para o gráfico
      const formattedData: FormattedFireData[] = responseData.map(
        (item: ApiFireData) => {
          const sigla = estadosSiglas[item.id_estado] || `UF${item.id_estado}`;

          return {
            state: sigla, // Usar diretamente a sigla
            fires: item.numero_focos_calor,
            risk: 0,
            area: 0,
          };
        }
      );

      // Atualizar os dados do gráfico
      setChartData(formattedData);
      console.log("Dados formatados:", formattedData);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Falha ao carregar dados do gráfico");
    } finally {
      setLoading(false);
    }
  };

  // Handlers para os dropdowns com atualização automática
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setMonth(newMonth);
    fetchData(newMonth, year);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setYear(newYear);
    fetchData(month, newYear);
  };

  const handleExport = () => {
    // Simulação de exportação de gráfico
    console.log("Exportando gráfico...");
    alert("Gráfico exportado com sucesso!");
  };

  const chartTitle = `Focos de Calor por Estado - ${month}/${year}`;

  // Generate month options
  const months = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, i) =>
    (currentYear - i).toString()
  );

  return (
    <ModalBase title="Gráficos" onClose={onClose} customWidth="60rem">
      <Container>
        <FilterGrid>
          <FilterGroup>
            <FilterLabel htmlFor="month">Mês</FilterLabel>
            <FilterSelect id="month" value={month} onChange={handleMonthChange}>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel htmlFor="year">Ano</FilterLabel>
            <FilterSelect id="year" value={year} onChange={handleYearChange}>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FilterGrid>

        <ChartContainer>
          <ChartTitle>{chartTitle}</ChartTitle>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="state"
                angle={-45}
                stroke="#999"
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#ff7300" }}
              />
              <Legend />
              <Bar dataKey="fires" name="Focos" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {error && (
          <div style={{ color: "red", textAlign: "center", margin: "10px 0" }}>
            {error}
          </div>
        )}

        <ExportButton
          onClick={handleExport}
          disabled={loading}
          style={{ width: "12rem" }}
        >
          <Download size={16} />
          Exportar PNG
        </ExportButton>
      </Container>
    </ModalBase>
  );
}
