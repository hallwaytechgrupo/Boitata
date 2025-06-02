import axios from "axios";

import fs from "node:fs";

export class TIFDownloader {
  constructor(private url: string, private downloadPath: string) {}

  async downloadTIF(): Promise<void> {
    let response;

    try {
      response = await axios.get(this.url, { responseType: "stream" });
    } catch (err) {
      console.error("Erro ao baixar TIF:", err);

      throw err;
    }

    if (!response || !response.data) {
      throw new Error("Resposta inválida ao baixar o TIF.");
    }

    try {
      await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(this.downloadPath);

        response.data.pipe(writer);

        writer.on("finish", () => resolve(undefined));

        writer.on("error", () => reject());
      });
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.warn(`Arquivo não encontrado (404): ${this.url} - ignorando.`);

        return; // Apenas ignore o arquivo e continue
      }

      throw new Error(`Falha ao baixar arquivo: ${error.message}`);
    }
  }
}
