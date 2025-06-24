import type { Pool } from 'pg';
import type { BiomaModel } from '../models';
import fs from 'node:fs';
import path from 'node:path';

export class BiomaRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Verifica se a tabela de biomas já contém dados
  async hasBiomas(): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      'SELECT 1 FROM tb_biomas LIMIT 1',
    );
    return (rowCount ?? 0) > 0;
  }

  // Insere um bioma no banco de dados
  async inserirBioma(bioma: BiomaModel): Promise<void> {
    const query = `
            INSERT INTO tb_biomas (id_bioma, bioma, geometry)
            VALUES ($1, $2, ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON($3), 4326)))
            ON CONFLICT (id_bioma) DO NOTHING
        `;
    const params = bioma.toSQLParams();

    await this.pool.query(query, params);
  }
}
