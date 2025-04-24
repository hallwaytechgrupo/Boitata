import app from "./app";
import pool from "./config/database";

const PORT = process.env.PORT || 3000;

const testConnection = async () => {
	try {
		const result = await pool.query("SELECT NOW()");
		console.log(
			"Conexão bem-sucedida! Hora atual no banco de dados:",
			result.rows[0].now,
		);
		return true;
	} catch (error) {
		console.error("Erro ao conectar ao banco de dados:", error);
		return false;
	}
};

const startServer = async () => {
	const isDbConnected = await testConnection();
	if (!isDbConnected) {
		console.error(
			"A aplicação será encerrada devido à falha na conexão com o banco de dados.",
		);
		process.exit(1);
	}

	app.listen(PORT, () => {
		console.log(`Servidor rodando na porta ${PORT}`);
	});
};

startServer();
