import { AreaQueimadaModel } from '../models/AreaQueimadaModel'; // Ajuste o caminho
import { query } from '../config/database';
import { EstadoService } from '../services/estado.service'; // ajuste o caminho conforme necessário


export const getDadosAreaQueimada = async (): Promise<any[]> => {
  const select = 'SELECT ST_AsGeoJSON(geometry) FROM tb_area_queimada'; // Ajuste conforme necessário
  const dados = await query(select);

  console.log('Dados de área queimada obtidos:', dados, 'registros', dados.rowCount);
  return dados.rows;
};

export const getDadosAreaQueimadaAgregados = async (criterios: any): Promise<any> => {
  // Exemplo: buscar os estados mais afetados por área queimada nos últimos 30 dias
  const estadosMaisAfetados = await query(`
    SELECT 
      e.id_estado, 
      e.estado, 
      SUM(aq.area_queimada) AS total_area_queimada
    FROM tb_area_queimada aq
    JOIN tb_estado e ON aq.id_estado = e.id_estado
    WHERE aq.data >= NOW() - INTERVAL '30 days'
    GROUP BY e.id_estado, e.estado
    ORDER BY total_area_queimada DESC
    LIMIT 5
  `);

  // Exemplo: buscar estatísticas de um estado específico (use criterios.id_estado se quiser)
  const dadosEstado = await query(`
    SELECT 
      e.id_estado, 
      e.estado, 
      SUM(aq.area_queimada) AS total_area_queimada
    FROM tb_area_queimada aq
    JOIN tb_estado e ON aq.id_estado = e.id_estado
    WHERE e.id_estado = $1
    GROUP BY e.id_estado, e.estado
  `, [criterios?.id_estado ?? 12]);

  return {
    estadosMaisAfetados: estadosMaisAfetados.rows,
    dadosEstado: dadosEstado.rows[0] || {},
  };
};