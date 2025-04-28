import fs from 'node:fs';
import path from 'node:path';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const saveToTypescriptFile = (fileName: string, data: any): void => {
  try {
    const filePath = path.resolve(__dirname, fileName);
    const fileContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    console.log(`Dados salvos em ${fileName} com sucesso!`);
  } catch (error) {
    console.error(`Erro ao salvar dados no arquivo ${fileName}:`, error);
    throw error;
  }
};

export const saveToCSVFile = async (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  stream: any,
  downloadPath: string,
): Promise<void> => {
  const writer = fs.createWriteStream(downloadPath);
  stream.pipe(writer);

  await new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};
