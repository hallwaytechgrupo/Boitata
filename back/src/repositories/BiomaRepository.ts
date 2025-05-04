import type { Pool } from 'pg';
import type { BiomaModel } from '../models';
import fs from 'node:fs';
import path from 'node:path';

export function formatSQL(query: string, params: any[]): string {
  const formattedQuery = query.replace(/\$(\d+)/g, (_, index) => {
    const param = params[Number(index) - 1];
    if (typeof param === 'string') {
      return `'${param.replace(/'/g, "''")}'`; // Escapa aspas simples
    }
    if (param === null || param === undefined) {
      return 'NULL';
    }
    return param;
  });

  const filePath = path.resolve(__dirname, '../biomas.sql');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8'); // Cria o arquivo se não existir
  }

  // Lê o conteúdo existente do arquivo
  const existingContent = fs.readFileSync(filePath, 'utf8');

  // Adiciona o SQL formatado como uma nova linha
  const newContent = `${existingContent}\n${formattedQuery}`;

  // Salva o conteúdo atualizado no arquivo
  fs.writeFileSync(filePath, newContent, 'utf8');

  console.log(`SQL salvo em: ${filePath}`);
  return formattedQuery;
}

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

    console.log('-----------BIOMA QUERY-----------');
    console.log(formatSQL(query, params));
    console.log('-----------BIOMA QUERY-----------');

    await this.pool.query(query, params);
  }
}
