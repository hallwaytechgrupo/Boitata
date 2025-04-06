# Estrutura da Pasta `back/` - Boitata

Este documento descreve a organização da pasta `back/` do projeto **Boitata**, que contém o back-end desenvolvido em Node.js com TypeScript. O back-end funciona como uma API REST, provavelmente hospedaremos na Digital Ocean, enquanto o front-end (em `front/`) é gerenciado separadamente no Vercel.
Por isso, a pasta `back/` é independente, com seu próprio `package.json`, e não depende de um gerenciador na raiz do repositório.

## O que é o MVC?

O **MVC** é uma forma de organizar o código de um programa, dividindo-o em três partes principais: **Model**, **View** e **Controller**. Pense nisso como uma equipe de trabalho onde cada um tem uma função específica:

- **Model (Modelo)**: É como o "banco de dados" ou a "memória" do sistema. Ele guarda e organiza as informações que o programa usa. No nosso caso, o "Model" vai guardar os dados sobre focos de calor, risco de fogo e áreas queimadas que pegamos do Programa Queimadas do INPE.
  - **Exemplo no Boitata**: Um modelo chamado `FocoDeCalor` que armazena informações como "estado", "bioma" e "data" de um foco de calor detectado pelo INPE.

- **View (Visão)**: É a parte que mostra as informações para o usuário, como uma tela ou página. No nosso projeto, a "View" não fica no back-end — ela está no front-end (em `front/`), feita com React, onde os gráficos e mapas vão aparecer.
  - **Exemplo no Boitata**: Um gráfico no front-end mostrando os focos de calor por estado, que pega os dados do back-end.

- **Controller (Controlador)**: É o "chefe" que recebe os pedidos do usuário, busca as informações no "Model" e decide o que mandar para a "View". No back-end, o "Controller" vai receber pedidos do front-end (ex.: "me dá os focos de calor do Paraná") e devolver os dados certos.
  - **Exemplo no Boitata**: Um controlador que, ao receber um pedido como `GET /api/focos/estado/PR`, busca os focos de calor no Paraná e envia a resposta.

No nosso projeto, como o front-end (React no Vercel) cuida da "View", o back-end (Node.js na Digital Ocean) foca só no **Model** e no **Controller**. O back-end será uma API que fornece os dados (como focos de calor por estado ou bioma) para o front-end exibir.

## Estrutura de Pastas

A estrutura abaixo foi pensada para atender aos requisitos do projeto Boitata, como "Focos de calor por estado" (RF01), "Risco de fogo por bioma" (RF04) e "Gráficos de área queimada" (RF09), usando Node.js e PostgreSQL, conforme o catálogo de tecnologias da FATEC.

```
back/
├───src/
│   ├───config/
│   ├───controllers/
│   ├───models/
│   ├───routes/
│   ├───services/
│   ├───types/
│   ├───utils/
│   └───index.ts
├───.env
├───package.json
└───tsconfig.json
```

### `config/`
- **Propósito**: Armazena configurações do servidor, como a conexão com o banco de dados PostgreSQL ou variáveis de ambiente.
- **Exemplo de uso**: `config/database.ts` para conectar ao PostgreSQL e acessar a tabela de focos de calor.
- **Por que usamos?**: Separar configurações facilita mudar coisas como o banco de dados ou a porta do servidor sem mexer no código principal.

### `controllers/`
- **Propósito**: Processa pedidos do front-end e devolve respostas, como os dados de focos de calor ou risco de fogo.
- **Exemplo de uso**: `controllers/focoController.ts` com uma função `getFocosPorEstado()` que retorna os focos de calor do Paraná (RF01).
- **Por que usamos?**: Organiza a lógica de resposta, conectando os pedidos do front-end aos dados no banco.

### `models/`
- **Propósito**: Define como os dados (ex.: focos de calor, risco de fogo) são estruturados no PostgreSQL.
- **Exemplo de uso**: `models/FocoDeCalor.ts` com campos como `id`, `estado`, `bioma` e `data`, refletindo os dados do INPE (RF01, RF02).
- **Por que usamos?**: Representa as informações do Programa Queimadas no banco, facilitando consultas como "focos por bioma".

### `routes/`
- **Propósito**: Define os endereços (endpoints) que o front-end pode chamar, como `/api/focos/estado`.
- **Exemplo de uso**: `routes/focoRoutes.ts` com um endpoint `GET /api/focos/estado/:estado` para RF01.
- **Por que usamos?**: Separa os caminhos da API da lógica, tornando mais fácil adicionar novos endpoints.

### `services/`
- **Propósito**: Contém a lógica para buscar e processar dados, como calcular o risco de fogo por bioma.
- **Exemplo de uso**: `services/focoService.ts` com uma função que filtra focos de calor por intervalo de tempo (RF10).
- **Por que usamos?**: Permite reutilizar código (ex.: para gráficos ou consultas) e facilita testes.

### `types/`
- **Propósito**: Guarda os tipos TypeScript para garantir que os dados sejam usados corretamente.
- **Exemplo de uso**: `types/foco.types.ts` com a interface `FocoDeCalor { id: number; estado: string; bioma: string; }`.
- **Por que usamos?**: Ajuda a evitar erros ao trabalhar com dados do INPE, como "estado" ou "bioma".

### `utils/`
- **Propósito**: Funções genéricas que ajudam em tarefas comuns.
- **Exemplo de uso**: `utils/formatDate.ts` para formatar datas dos focos de calor (usado em RF10).
- **Por que usamos?**: Mantém o código limpo com ferramentas reutilizáveis.

### `.env`
- **Propósito**: Armazena variáveis sensíveis, como a conexão com o PostgreSQL ou a porta do servidor.
- **Exemplo de uso**: `DATABASE_URL=postgres://user:pass@localhost:5432/boitata`.
- **Por que usamos?**: Mantém segredos fora do código e facilita ajustes no deploy.

### `index.ts`
- **Propósito**: Inicia o servidor e conecta todas as partes da API.
- **Exemplo de uso**: Configura o Express e usa as rotas como `/api/focos`.
- **Por que usamos?**: É o ponto de partida que a Digital Ocean vai executar.

### `package.json`
- **Propósito**: Lista as dependências (ex.: Express, PostgreSQL) e scripts para rodar o back-end.
- **Exemplo de uso**: `npm run dev` para desenvolvimento e `npm start` para produção.
- **Por que usamos?**: Gerencia tudo que o back-end precisa na Digital Ocean.

### `tsconfig.json`
- **Propósito**: Configura o TypeScript para compilar o código para Node.js.
- **Exemplo de uso**: Define que o código compilado vai para `dist/`.
- **Por que usamos?**: Garante que o TypeScript funcione bem no back-end.