// Importa as funções do serviço que vamos testar
import { getDadosAreaQueimada, getDadosAreaQueimadaAgregados } from '../../services/area.service';

// Mocka o módulo que contém a função `query` do banco de dados
// Isso substitui a implementação real da função `query` por uma simulada
jest.mock('../../config/database', () => ({
  // Define que a função 'query' é uma função mockada do Jest
  query: jest.fn(),
}));

// Importa a função `query` mockada para que possamos controlá-la nos testes
import { query } from '../../config/database';

// O bloco describe agrupa os testes para o serviço area.service
describe('area.service', () => {
  // Antes de cada teste, limpa todos os mocks para garantir que cada teste seja isolado
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa chamadas, instâncias e retornos simulados
  });

  // --- Testes para getDadosAreaQueimada ---
  describe('getDadosAreaQueimada', () => {
    it('deve retornar dados de área queimada no formato GeoJSON', async () => {
      // 1. Arrange (Organizar): Define o que o mock da função `query` deve retornar
      // Simulamos a resposta do banco de dados com uma rowCount e as linhas esperadas
      (query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [
          { st_asgeojson: '{"type":"Polygon","coordinates":[[[-40,-10],[-39,-10],[-39,-11],[-40,-11],[-40,-10]]]}' },
        ],
      });

      // 2. Act (Agir): Chama a função do serviço que estamos testando
      const dados = await getDadosAreaQueimada();

      // 3. Assert (Verificar): Faz as asserções para validar o resultado
      // Verifica se a função `query` foi chamada com a SQL correta
      expect(query).toHaveBeenCalledWith('SELECT ST_AsGeoJSON(geometry) FROM tb_area_queimada');
      // Verifica se o resultado retornado pelo serviço está no formato esperado
      expect(dados).toEqual([
        { st_asgeojson: '{"type":"Polygon","coordinates":[[[-40,-10],[-39,-10],[-39,-11],[-40,-11],[-40,-10]]]}' },
      ]);
      expect(dados.length).toBe(1); // Verifica a quantidade de registros
    });

    it('deve retornar um array vazio se não houver dados no banco', async () => {
      // 1. Arrange: Simula uma resposta do banco de dados sem linhas
      (query as jest.Mock).mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      // 2. Act: Chama a função
      const dados = await getDadosAreaQueimada();

      // 3. Assert: Verifica se o resultado é um array vazio
      expect(query).toHaveBeenCalledTimes(1); // Garante que a query foi feita
      expect(dados).toEqual([]);
      expect(dados.length).toBe(0);
    });

    it('deve lançar um erro se a consulta ao banco de dados falhar', async () => {
      // 1. Arrange: Simula um erro na função `query`
      const mockError = new Error('Erro de conexão com o banco de dados');
      (query as jest.Mock).mockRejectedValue(mockError);

      // 2. Act & 3. Assert: Espera que a função chame um erro
      await expect(getDadosAreaQueimada()).rejects.toThrow(mockError);
      expect(query).toHaveBeenCalledTimes(1);
    });
  });

  // --- Testes para getDadosAreaQueimadaAgregados ---
  describe('getDadosAreaQueimadaAgregados', () => {
    it('deve retornar dados agregados para os estados mais afetados', async () => {
      // 1. Arrange: Simula as duas respostas da função `query` para este teste
      (query as jest.Mock)
        .mockResolvedValueOnce({ // Primeira chamada (estadosMaisAfetados)
          rowCount: 2,
          rows: [
            { id_estado: 35, estado: 'SP', total_area_queimada: 1500.50 },
            { id_estado: 33, estado: 'RJ', total_area_queimada: 800.25 },
          ],
        })
        .mockResolvedValueOnce({ // Segunda chamada (dadosEstado)
          rowCount: 1,
          rows: [
            { id_estado: 12, estado: 'AC', total_area_queimada: 300.00 },
          ],
        });

      // 2. Act: Chama a função (com um critério de exemplo)
      const criterios = { id_estado: 12 };
      const resultado = await getDadosAreaQueimadaAgregados(criterios);

      // 3. Assert: Verifica as chamadas da query e o resultado
      expect(query).toHaveBeenCalledTimes(2); // Duas chamadas de query

      // Verifica a primeira chamada (estadosMaisAfetados)
      expect(query).toHaveBeenCalledWith(
        expect.stringMatching(/SELECT\s+e\.id_estado,\s+e\.estado,\s+SUM\(aq\.area_queimada\)\s+AS\s+total_area_queimada\s+FROM\s+tb_area_queimada\s+aq\s+JOIN\s+tb_estado\s+e\s+ON\s+aq\.id_estado\s+=\s+e\.id_estado\s+WHERE\s+e\.id_estado\s+=\s+\$1\s+GROUP\s+BY\s+e\.id_estado,\s+e\.estado/i),
        [12]
      );

      // Verifica a segunda chamada (dadosEstado)
      expect(query).toHaveBeenCalledWith(expect.stringMatching(/SELECT\s+e\.id_estado,\s+e\.estado,\s+SUM\(aq\.area_queimada\)\s+AS\s+total_area_queimada\s+FROM\s+tb_area_queimada\s+aq\s+JOIN\s+tb_estado\s+e\s+ON\s+aq\.id_estado\s+=\s+e\.id_estado\s+WHERE\s+e\.id_estado\s+=\s+\$1\s+GROUP\s+BY\s+e\.id_estado,\s+e\.estado/i), [12]);


      expect(resultado.estadosMaisAfetados).toEqual([
        { id_estado: 35, estado: 'SP', total_area_queimada: 1500.50 },
        { id_estado: 33, estado: 'RJ', total_area_queimada: 800.25 },
      ]);
      expect(resultado.dadosEstado).toEqual(
        { id_estado: 12, estado: 'AC', total_area_queimada: 300.00 }
      );
    });

    it('deve retornar dados vazios se as consultas não retornarem resultados', async () => {
      // 1. Arrange: Simula respostas vazias para ambas as queries
      (query as jest.Mock)
        .mockResolvedValueOnce({ rowCount: 0, rows: [] }) // Primeira chamada
        .mockResolvedValueOnce({ rowCount: 0, rows: [] }); // Segunda chamada

      const criterios = { id_estado: 99 }; // Um ID que não existe
      const resultado = await getDadosAreaQueimadaAgregados(criterios);

      // 3. Assert
      expect(query).toHaveBeenCalledTimes(2);
      expect(resultado.estadosMaisAfetados).toEqual([]);
      expect(resultado.dadosEstado).toEqual({}); // Verifica se retorna objeto vazio
    });

    it('deve lançar um erro se a primeira consulta agregada falhar', async () => {
      // 1. Arrange: Simula um erro na primeira chamada da função `query`
      const mockError = new Error('Erro na primeira consulta agregada');
      (query as jest.Mock).mockRejectedValue(mockError);

      // 2. Act & 3. Assert
      await expect(getDadosAreaQueimadaAgregados({})).rejects.toThrow(mockError);
      expect(query).toHaveBeenCalledTimes(1); // A segunda query não deve ser chamada
    });

    it('deve lançar um erro se a segunda consulta agregada falhar', async () => {
      // 1. Arrange: Simula sucesso na primeira query e erro na segunda
      (query as jest.Mock)
        .mockResolvedValueOnce({ rowCount: 1, rows: [{}] }) // Sucesso na primeira
        .mockRejectedValueOnce(new Error('Erro na segunda consulta agregada')); // Erro na segunda

      // 2. Act & 3. Assert
      await expect(getDadosAreaQueimadaAgregados({})).rejects.toThrow('Erro na segunda consulta agregada');
      expect(query).toHaveBeenCalledTimes(2); // Ambas as queries foram chamadas antes do erro
    });
  });
});