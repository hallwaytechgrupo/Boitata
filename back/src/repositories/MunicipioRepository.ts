import type { Pool } from 'pg';
import type { MunicipioModel } from '../models';

export class MunicipioRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Verifica se a tabela de municípios já contém dados
  async hasMunicipios(): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      'SELECT 1 FROM tb_municipios LIMIT 1',
    );
    return (rowCount ?? 0) > 0;
  }

  // Verifica se as áreas operacionais já estão no banco
  async verificarAreasOperacionais(): Promise<boolean> {
    const query = `
            SELECT COUNT(*) AS count
            FROM tb_municipios
            WHERE id_municipio IN (4300001, 4300002)
        `;
    const result = await this.pool.query(query);
    const count = Number(result.rows[0].count);
    return count === 2; // Retorna true se as áreas já existem
  }

  // Insere um município no banco de dados
  async inserirMunicipio(municipio: MunicipioModel): Promise<void> {
    const query = `
            INSERT INTO tb_municipios (id_municipio, id_estado, municipio, geometry)
        VALUES ($1, $2, $3, ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON($4), 4326)))
        ON CONFLICT (id_municipio) DO NOTHING
        `;
    const params = municipio.toSQLParams();

    await this.pool.query(query, params);
  }
}
