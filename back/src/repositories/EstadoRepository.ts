import type { Pool } from 'pg';
import type { EstadoModel } from '../models';

export class EstadoRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Verifica se a tabela de estados já contém dados
  async hasEstados(): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      'SELECT 1 FROM tb_estados LIMIT 1',
    );
    return (rowCount ?? 0) > 0;
  }

  // Insere um estado no banco de dados
  async inserirEstado(estado: EstadoModel): Promise<void> {
    const query = `
            INSERT INTO tb_estados (id_estado, estado, geometry)
            VALUES ($1, $2, ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON($3), 4326)))
            ON CONFLICT (id_estado) DO NOTHING
        `;
    const params = estado.toSQLParams();

    await this.pool.query(query, params);
  }
}
