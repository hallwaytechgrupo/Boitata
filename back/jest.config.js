// jest.config.js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Onde seus arquivos de teste estão localizados
  // Geralmente em uma pasta `__tests__` ou com o sufixo `.test.ts`
  testMatch: [
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).ts"
  ],
  // Ignorar o diretório `node_modules` e o diretório `dist` (onde o TS compila)
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ],
  // Mapear módulos para alias (se você usa caminhos de alias no tsconfig.json)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1" // Exemplo se você usar `@/` para `src/`
  },
  // Configurações para coletar cobertura de código
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/index.ts", // Não precisa testar o arquivo de inicialização
    "!src/app.ts",    // Não precisa testar o arquivo de configuração do Express
    "!src/database/index.ts", // Exclua arquivos de conexão/configuração se não tiver lógica para testar
    "!src/database/verifyConnection.ts",
    "!src/types/**/*.ts", // Exclua apenas arquivos de tipos
    "!src/models/base/*.ts" // Se for apenas classes base abstratas sem lógica
  ],
  coverageReporters: ["json-summary", "text", "lcov"], // Formatos de relatório
};