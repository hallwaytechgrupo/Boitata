import app from './app';
import pool from './config/database';
import { verifyDatabaseConnection } from './database/verifyConnection';
import { initializeDatabase } from './database/initializeDatabase';

const PORT = process.env.PORT || 2000;
const isCloud = process.env.NODE_ENV === 'cloud';

const startServer = () => {
  app.listen(PORT, () => {
    console.log(
      `Servidor rodando na porta ${PORT} no ambiente ${isCloud ? 'PRODUÇÃO' : 'LOCAL'}`,
    );
  });
};

const initializeApplication = async () => {
  try {
    console.log('+++[INICIANDO APLICAÇÃO]+++\n');
    console.log(' - Verificando conexão com o banco de dados...');
    const isDbConnected = await verifyDatabaseConnection(pool);

    if (!isDbConnected) {
      console.error(
        '- A aplicação será encerrada devido à falha na conexão com o banco de dados.',
      );
      process.exit(1);
    }

    if (!isCloud) {
      console.log(
        ' - Ambiente de desenvolvimento detectado. Inicializando banco de dados...',
      );
      await initializeDatabase(pool);
      console.log('- Inicialização do banco de dados concluída!\n');
    } else {
      console.log(
        ' - Ambiente de produção detectado. Pulando inicialização do banco de dados.',
      );
    }

    console.log('- Aplicação pronta para ser executada!\n');

    startServer();
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
    process.exit(1);
  }
};

initializeApplication();
