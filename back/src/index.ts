import app from './app';
import pool from './config/database';
import { verifyDatabaseConnection } from './database/verifyConnection';
import { initializeDatabase } from './database/setupDatabase';

const PORT = process.env.PORT || 3000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
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
    await initializeDatabase(pool);
    console.log('- Aplicação pronta para ser executada!\n');

    startServer();
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
    process.exit(1);
  }
};

initializeApplication();
