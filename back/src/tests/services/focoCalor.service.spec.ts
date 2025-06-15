// back/__tests__/services/focoCalor.service.test.ts

import { FocoCalorService } from '../../services/focoCalor.service'; // O serviço a ser testado
import { query } from '../../config/database'; // Importa a função `query` para mockar
import { FocosCalorRepository } from '../../repositories/FocosCalorRepository'; // Importa o repositório para mockar
import { format, parse } from 'date-fns'; // Importa date-fns para mockar se necessário
import { FeatureCollection } from '../../types/FocoCalorEstado';

// --- MOCKS ---
// Mocka o módulo date-fns. Isso é útil para isolar o teste do comportamento real das datas
// e garantir que toISO se comporta como esperado com as entradas mockadas.
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => {
    // Simula o formato ISO para datas
    if (formatStr === 'yyyy-MM-dd HH:mm:ss') {
      return '2023-01-01 10:00:00'; // Retorno fixo para o mock
    }
    return 'mocked-date';
  }),
  parse: jest.fn((dateStr, formatStr, refDate) => new Date(dateStr)), // Simula o parse
}));

// Mocka a função `query` do banco de dados
jest.mock('../../config/database', () => ({
  query: jest.fn(),
}));

// Mocka o FocosCalorRepository.
// Quando FocoCalorService tentar instanciar new FocosCalorRepository(),
// ele vai usar este mock. Precisamos que ele retorne um objeto com os métodos mockados.
jest.mock('../../repositories/FocosCalorRepository', () => {
  return {
    FocosCalorRepository: jest.fn().mockImplementation(() => {
      // Define os métodos que o repositório mockado deve ter e mocka cada um
      return {
        getGraficoDataPorAnoMes: jest.fn(),
        getFocosByMunicipioId: jest.fn(),
        getFocosByEstado: jest.fn(),
        getEstatisticasBioma: jest.fn(),
        getEstatisticasMunicipio: jest.fn(),
        getEstatisticasEstado: jest.fn(),
      };
    }),
  };
});

// --- VARIÁVEIS COMUNS DE TESTE ---
const mockFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      },
      properties: {},
    },
  ],
} as FeatureCollection; // Mocka uma FeatureCollection para os testes
const mockEstatisticasEstado: any = {
  id_estado: 1,
  estado: 'SP',
  top_cidades: [{ nome: 'Cidade A', focos: 100 }],
  maior_frp: { municipio: 'Muni A', frp: 500, data: '2023-01-01' },
  ultima_atualizacao: '2023-01-01T10:00:00Z',
};

// --- BLOCO PRINCIPAL DE TESTES ---
describe('FocoCalorService', () => {
  let service: FocoCalorService; // Instância do serviço a ser testada
  let mockRepository: jest.Mocked<FocosCalorRepository>; // Tipo mockado do repositório

  // `beforeEach` é executado antes de cada caso de teste.
  // Garante um ambiente limpo para cada teste.
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks();
    // Instancia o serviço, que por sua vez instanciará o repositório mockado
    service = new FocoCalorService();
    // Pega a instância mockada do repositório
    mockRepository = (FocosCalorRepository as jest.Mock).mock.results[0].value;
  });

  // --- Testes para a função utilitária toISO ---
  describe('toISO', () => {
    // Para testar toISO, precisamos acessar a função diretamente.
    // Como ela não é exportada, vamos testá-la indiretamente ou
    // copiá-la para o teste para testá-la como uma unidade separada.
    // Para fins de demonstração, vou copiá-la aqui.
    const toISO = (dateStr?: string) => {
      if (!dateStr) return undefined;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return `${dateStr} 00:00:00`;
      }
      if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) {
        return dateStr;
      }
      const parsed = parse(
        dateStr,
        dateStr.length > 10 ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy',
        new Date(),
      );
      return format(parsed, 'yyyy-MM-dd HH:mm:ss');
    };

    it('deve retornar undefined se a data for undefined', () => {
      expect(toISO(undefined)).toBeUndefined();
    });

    it('deve formatar "YYYY-MM-DD" para "YYYY-MM-DD 00:00:00"', () => {
      expect(toISO('2023-10-26')).toBe('2023-10-26 00:00:00');
    });

    it('deve retornar "YYYY-MM-DD HH:mm:ss" como está', () => {
      expect(toISO('2023-10-26 14:30:00')).toBe('2023-10-26 14:30:00');
    });

    it('deve formatar "dd/MM/yyyy" para "yyyy-MM-dd HH:mm:ss"', () => {
      // Mockamos format e parse para prever o resultado
      (parse as jest.Mock).mockReturnValue(new Date('2023-01-01T10:00:00Z'));
      (format as jest.Mock).mockReturnValue('2023-01-01 10:00:00');

      expect(toISO('01/01/2023')).toBe('2023-01-01 10:00:00');
      expect(parse).toHaveBeenCalledWith('01/01/2023', 'dd/MM/yyyy', expect.any(Date));
      expect(format).toHaveBeenCalledWith(expect.any(Date), 'yyyy-MM-dd HH:mm:ss');
    });

    it('deve formatar "dd/MM/yyyy HH:mm" para "yyyy-MM-dd HH:mm:ss"', () => {
      (parse as jest.Mock).mockReturnValue(new Date('2023-01-01T10:30:00Z'));
      (format as jest.Mock).mockReturnValue('2023-01-01 10:30:00');

      expect(toISO('01/01/2023 10:30')).toBe('2023-01-01 10:30:00');
      expect(parse).toHaveBeenCalledWith('01/01/2023 10:30', 'dd/MM/yyyy HH:mm', expect.any(Date));
      expect(format).toHaveBeenCalledWith(expect.any(Date), 'yyyy-MM-dd HH:mm:ss');
    });
  });

  // --- Testes para getGraficoData ---
  describe('getGraficoData', () => {
    it('deve chamar o repositório e retornar os dados do gráfico', async () => {
      // Configura o mock para retornar um valor específico
      mockRepository.getGraficoDataPorAnoMes.mockResolvedValue([
        { ano: 2023, mes: 1, id_estado: 1, numero_focos_calor: 100 },
      ]);

      const result = await service.getGraficoData(2023, 1);

      // Verifica se o método do repositório foi chamado com os argumentos corretos
      expect(mockRepository.getGraficoDataPorAnoMes).toHaveBeenCalledWith(2023, 1);
      // Verifica se o serviço retornou o valor esperado
      expect(result).toEqual([
        { ano: 2023, mes: 1, id_estado: 1, numero_focos_calor: 100 },
      ]);
    });

    it('deve lançar um erro se o repositório falhar', async () => {
      const mockError = new Error('Erro no repositório do gráfico');
      mockRepository.getGraficoDataPorAnoMes.mockRejectedValue(mockError);

      await expect(service.getGraficoData(2023, 1)).rejects.toThrow(mockError);
    });
  });

  // --- Testes para getFocosByMunicipio ---
  describe('getFocosByMunicipio', () => {
    it('deve chamar o repositório com datas formatadas', async () => {
      // Mockamos format e parse para prever o resultado de toISO
      (parse as jest.Mock).mockReturnValue(new Date('2023-01-01T00:00:00Z'));
      (format as jest.Mock).mockReturnValue('2023-01-31 00:00:00');

      mockRepository.getFocosByMunicipioId.mockResolvedValue(mockFeatureCollection);

      const result = await service.getFocosByMunicipio('123', '2023-01-01', '2023-01-31');

      expect(mockRepository.getFocosByMunicipioId).toHaveBeenCalledWith(
        '123',
        '2023-01-01 00:00:00', // Espera o formato toISO
        '2023-01-31 00:00:00', // Espera o formato toISO
      );
      expect(result).toEqual(mockFeatureCollection);
    });

    it('deve chamar o repositório com datas undefined se não forem fornecidas', async () => {
      mockRepository.getFocosByMunicipioId.mockResolvedValue(mockFeatureCollection);

      const result = await service.getFocosByMunicipio('123');

      expect(mockRepository.getFocosByMunicipioId).toHaveBeenCalledWith(
        '123',
        undefined, // Espera undefined
        undefined, // Espera undefined
      );
      expect(result).toEqual(mockFeatureCollection);
    });
  });

  // --- Testes para getFocosByEstado ---
  describe('getFocosByEstado', () => {
    it('deve chamar o repositório com datas formatadas', async () => {
      (parse as jest.Mock).mockReturnValue(new Date('2023-01-01T00:00:00Z'));
      (format as jest.Mock).mockReturnValue('2023-01-01 00:00:00');

      mockRepository.getFocosByEstado.mockResolvedValue(mockFeatureCollection);

      const result = await service.getFocosByEstado(1, '2023-01-01', '2023-01-31');

      expect(mockRepository.getFocosByEstado).toHaveBeenCalledWith(
        1,
        '2023-01-01 00:00:00',
        '2023-01-31 00:00:00',
      );
      expect(result).toEqual(mockFeatureCollection);
    });
  });

  // --- Testes para getFocosByBioma ---
  describe('getFocosByBioma', () => {
    it('deve retornar FeatureCollection se a query tiver resultados válidos', async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{ get_focos_geojson_bioma: mockFeatureCollection }],
      });

      const result = await service.getFocosByBioma(1, '2023-01-01', '2023-01-31');

      expect(query).toHaveBeenCalledWith(
        'SELECT * FROM get_focos_geojson_bioma($1, $2, $3)',
        [1, '2023-01-01', '2023-01-31'],
      );
      expect(result).toEqual(mockFeatureCollection);
    });

    it('deve retornar FeatureCollection vazia se a query não tiver resultados', async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      const result = await service.getFocosByBioma(1);

      expect(query).toHaveBeenCalledWith(
        'SELECT * FROM get_focos_geojson_bioma($1, $2, $3)',
        [1, null, null], // Datas nulas devem ser passadas como null
      );
      expect(result).toEqual({ type: 'FeatureCollection', features: [] });
    });

    it('deve retornar FeatureCollection vazia se get_focos_geojson_bioma for nulo', async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [{ get_focos_geojson_bioma: null }],
      });

      const result = await service.getFocosByBioma(1);

      expect(result).toEqual({ type: 'FeatureCollection', features: [] });
    });
  });

  // --- Testes para getBasicInfoByEstado ---
  describe('getBasicInfoByEstado', () => {
    it('deve retornar estatísticas do estado se a query tiver resultados', async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [mockEstatisticasEstado],
      });

      const result = await service.getBasicInfoByEstado(1);

      expect(query).toHaveBeenCalledWith(
        'SELECT * FROM v_estatisticas_estado_final WHERE id_estado = $1',
        [1],
      );
      expect(result).toEqual(mockEstatisticasEstado);
    });

    it('deve retornar estatísticas padrão se a query não tiver resultados', async () => {
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      const result = await service.getBasicInfoByEstado(99);

      expect(result).toEqual({
        id_estado: 99,
        estado: '',
        top_cidades: [],
        maior_frp: {
          municipio: 'Nenhum dado disponível',
          frp: 0,
          data: '',
        },
        ultima_atualizacao: expect.any(String), // A data será a do new Date().toISOString()
      });
    });
  });

  // --- Testes para getEstatisticasBioma, getEstatisticasMunicipio, getEstatisticasEstado ---
  // Estes são simples, pois apenas chamam o repositório e repassam o erro.
  // O teste principal é garantir que o repositório é chamado.
  describe('getEstatisticasBioma', () => {
    it('deve chamar o repositório e retornar estatísticas de bioma', async () => {
      const mockResult = [{ id_bioma: 1, bioma: 'Bioma A', total_focos_30dias: 500 }];
      mockRepository.getEstatisticasBioma.mockResolvedValue(mockResult);

      const result = await service.getEstatisticasBioma(1);
      expect(mockRepository.getEstatisticasBioma).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });

    it('deve lançar um erro se o repositório falhar', async () => {
      const mockError = new Error('Erro ao buscar estatísticas do bioma');
      mockRepository.getEstatisticasBioma.mockRejectedValue(mockError);
      await expect(service.getEstatisticasBioma(1)).rejects.toThrow(mockError);
    });
  });

  describe('getEstatisticasMunicipio', () => {
    it('deve chamar o repositório e retornar estatísticas de município', async () => {
      const mockResult = [{ id_municipio: 1, municipio: 'Muni A', total_focos_30dias: 120 }];
      mockRepository.getEstatisticasMunicipio.mockResolvedValue(mockResult);

      const result = await service.getEstatisticasMunicipio(1);
      expect(mockRepository.getEstatisticasMunicipio).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getEstatisticasEstado', () => {
    it('deve chamar o repositório e retornar estatísticas de estado', async () => {
      const mockResult = [{ id_estado: 1, estado: 'Estado A', total_focos_30dias: 250 }];
      mockRepository.getEstatisticasEstado.mockResolvedValue(mockResult);

      const result = await service.getEstatisticasEstado(1);
      expect(mockRepository.getEstatisticasEstado).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  // --- Testes para getResumoDashboard ---
  describe('getResumoDashboard', () => {
    it('deve retornar o resumo do dashboard com dados calculados', async () => {
      // Mocka as dependências do repositório
      mockRepository.getEstatisticasBioma.mockResolvedValue([
        { id_bioma: 1, bioma: 'Bioma A', total_focos_30dias: 500 },
        { id_bioma: 2, bioma: 'Bioma B', total_focos_30dias: 300 },
        { id_bioma: 3, bioma: 'Bioma C', total_focos_30dias: 200 },
        { id_bioma: 4, bioma: 'Bioma D', total_focos_30dias: 50 }, // Fora do top 3
      ]);
      mockRepository.getEstatisticasEstado.mockResolvedValue([
        { id_estado: 1, estado: 'Estado A', total_focos_30dias: 700 },
        { id_estado: 2, estado: 'Estado B', total_focos_30dias: 600 },
        { id_estado: 3, estado: 'Estado C', total_focos_30dias: 500 },
        { id_estado: 4, estado: 'Estado D', total_focos_30dias: 400 },
        { id_estado: 5, estado: 'Estado E', total_focos_30dias: 300 },
        { id_estado: 6, estado: 'Estado F', total_focos_30dias: 100 }, // Fora do top 5
      ]);

      const result = await service.getResumoDashboard();

      expect(mockRepository.getEstatisticasBioma).toHaveBeenCalledTimes(1);
      expect(mockRepository.getEstatisticasEstado).toHaveBeenCalledTimes(1);

      expect(result.totalFocos).toBe(1050); // 500+300+200+50
      expect(result.biomasMaisAfetados).toHaveLength(3);
      expect(result.biomasMaisAfetados[0]).toEqual({ id: 1, bioma: 'Bioma A', total: 500, percentual: '47.6' });
      expect(result.biomasMaisAfetados[1]).toEqual({ id: 2, bioma: 'Bioma B', total: 300, percentual: '28.6' });
      expect(result.biomasMaisAfetados[2]).toEqual({ id: 3, bioma: 'Bioma C', total: 200, percentual: '19.0' });

      expect(result.estadosMaisAfetados).toHaveLength(5);
      expect(result.estadosMaisAfetados[0]).toEqual({ id_estado: 1, estado: 'Estado A', total_focos_30dias: 700 });
      // Verifica a ordem e o slice
      expect(result.estadosMaisAfetados[4]).toEqual({ id_estado: 5, estado: 'Estado E', total_focos_30dias: 300 });
    });

    it('deve lidar com biomas vazios no resumo do dashboard', async () => {
      mockRepository.getEstatisticasBioma.mockResolvedValue([]);
      mockRepository.getEstatisticasEstado.mockResolvedValue([]);

      const result = await service.getResumoDashboard();

      expect(result.totalFocos).toBe(0);
      expect(result.biomasMaisAfetados).toEqual([]);
      expect(result.estadosMaisAfetados).toEqual([]);
    });

    it('deve lançar um erro se getEstatisticasBioma falhar no resumo', async () => {
      const mockError = new Error('Erro ao buscar biomas');
      mockRepository.getEstatisticasBioma.mockRejectedValue(mockError);
      await expect(service.getResumoDashboard()).rejects.toThrow(mockError);
    });

    it('deve lançar um erro se getEstatisticasEstado falhar no resumo', async () => {
      mockRepository.getEstatisticasBioma.mockResolvedValue([
        { id_bioma: 1, bioma: 'Bioma A', total_focos_30dias: 100 },
      ]);
      const mockError = new Error('Erro ao buscar estados');
      mockRepository.getEstatisticasEstado.mockRejectedValue(mockError);
      await expect(service.getResumoDashboard()).rejects.toThrow(mockError);
    });
  });
});
