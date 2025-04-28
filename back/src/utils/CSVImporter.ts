import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export class CSVImporter_v2 {
  validarArquivo(filePath: string): void {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Arquivo CSV não encontrado no caminho: ${absolutePath}`);
    }
    if (path.extname(absolutePath) !== '.csv') {
      throw new Error(`O arquivo deve ser um CSV: ${absolutePath}`);
    }
    if (fs.statSync(absolutePath).size === 0) {
      throw new Error(`O arquivo está vazio: ${absolutePath}`);
    }
    console.log(`✓ Arquivo CSV validado: ${absolutePath}`);
  }

  calcularHashDoArquivo(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
  }
}
