
# Sprint 1

| **ATIVIDADES** |
| --- |
| Pesquisar documentação (2) - pesquisar formato padrao para documentaçõa de api, boas praticas e ferramentas que podem auxiliar no processo |
| Pesquisar e definier entre Chart.js ou D3.js (2) - pesquisar sobre as duas bibliotecas graficas mais utilizadas e se sao compativeis com as necessidades do projeto, bem como sua usabilidade. |
| Pesquidar e definir bibliotecas para os graficos (3) - pesquisar outras bibliotecas graficas, se encontrar alguma com usabilidade simplificada ou com melhor compatibilidade para o projeto, definir como escocolhida e apresentar para a equipe|
| Pesquisar e obter os shapefiles dos Biomas (2) - verificar se assim como os estados, se ha disponibilidade dos shapefiles dos biomas brasileiros e obter os arquivos para uso posterior |
| Criar os diagramas de casos de uso (5) - criar o diagrama de classes com base no recomendado pelo professor Andre e seguindo o padrao internacional UML, e suas normativas |
| Criar os diagramas de classe (5) - criar o diagrama de classes para o projeto, com previsibilidade de correções futuras, mesmo que o mais completo possivel |
| Prototipagem Figma (5) - criar o prototipo no figma para o visual do projeto, de forma interativa e englobando todas as modalidades de visualização previstas para as entregas, respeitando os requisitos e as definicões escolhidas em reunião com o o restante da equipe |
| Modelar dataBase (13) - Modelar o banco de dados, aplicando as normalizações, de forma a atender as necessidades do projeto e englobar todos os dados necessarios para seu funcionamento |
| Definir CSS (3) - definir o CSS para o projeto, seguindo o prototipo figma e levando em consideração a usabilidade do react |
| Documentar estrutura do Banco de dados (3) - documentar a estrutra de dados, de forma a indicar todas as tabelas, relacionamentos, procedures, triggers e demais funcionalidades do banco, para auxiliar a fase de desenvolvimento do back |
| Criar os arquivos de tipos - seguindo o diagrama de classes (8) - criar os arquivos type, seguindo as necessidades do projeto e especificações do diagramas de classe - utilizando o conceito de blocos construtores com orientação a objeto |
| Criar o DataBase - definindo seus scripts, procedures e afins (8) - criar o script para criação do dataBase e realizar os testes, seguindo o modelo DER realizado anteriormente na mesma sprint, testar implementações e pesquisas e definir procedures, triggers e afins. - utilizando a teoria dos conjuntos aplicada ao banco de dados, utilizando metodos join |
| Estruturar o back-end do projeto (3) - criar as pastas e o json, com as dependencias iniciais para o projeto, de forma a iniciar a estruturação para a criação dos arquivos de classe e afins |
| Estruturar o front-end do projeto (3) - criar as pastas e o json, com as dependencias iniciais para o projeto, de forma a iniciar a estruturação para a criação dos arquivos de classe e afins |

<br>
<br>
<br>

---

<br>
<br>
<br>

# Sprint 2

| **ATIVIDADES** |
| --- |
| Conectar com o DB: instalar pacote pg, criar arquivo .env e configurar as credenciais de conexao do banco, criar a conexão utilizando a biblioteca PG no arquivo db.ts(./src) dentro da pasta back |
| Criar API com o expresse: Criar o index.ts no back para iniciar a aplicação como servidor, configurando sua conexão com o DB, verifique as configuração do JSON para inicio, e comando para iniciar o serviço.<br> - criar o arquivo index.ts com o setup basico do express<br> - criar rota de teste para verificar conexão com o banco <br> - adicionar o script start no packege.json e testar o servidor com a rota teste |
| Criar os endpoints no back-end: implementando os endpoints de cada finalidade, como focos de calor, areas queimadas, risco de fogo. <br> - Criar arquivo routes.ts e para definir as rotas <br> - implementar endpoint GET para focos de calor <br> - implementar endpoint GET para áras queimadas <br> -Implementar endpoint GET para risco de fogo. |
| Criar os Serviços: para processamento de dados e consultas ao DB <br> - Criar o serviço e metodos para focos de calor (getAll e metodos de filtro) <br> - Criar o serviço e metodos para area queimada (getAll e metodos de filtro) <br - Criar o serviço e metodos para risco de fogo (getAll e metodos de filtro) <br|
| Implementar os controladores: conetar os Serviços com os endpoints <br> - criar controlador para focos de calor <br> - criar o controlador para areas queimadas <br> - criar o controlador para risco de fogo <br> - atualizar as rotas em routes.ts para usar os controladores |
| Criar modal de pesquisa(como componentes react): em versoes de desenvolvimento, com as opçoes de filtragem por bioma, estado, municipio, e botão para selecão manual de area de pesquisa <br> - Criar componente ShearchModal.tsx <br> - Adicionar select para o bioma <br> - adicionar inputs para estado e municipio <br> - Adicionar botao de submit <br> - adicionar botão para seleção manual de area |
| Criar os componentes React para pagina de Graficos: seguindo mesmo modelo de modal de pesquisa, porem com visualização dos graficos, para as areas selecionadas, atenção ao uso do context para direcionar os dados selecionados na pesquisa e na exibição para a criação dos graficos de acordo com os filtros ativos <br> - Instalar e configurar biblioteca Recharts <br> - Criar o contexto para filtragem dos dados e exibição dos graficos e mapas de acordo com os filtros quando selecionados, e implementa-lo no app.tsx <br> - Adicionar os graficos de barra com o recharts <br> - usar contexto para exibir filtros ativos <br>|
| Conectar front-back: Criar os serviços para consumir o end-points do back: <br> - Criar arquivo api.ts, com as funçoes Fecth, definindo URL base do backend (sugestoes: ``./src/services/api,`` rodando em ``http://localhost:<porta>/api``)  <br> - Criar serviçoas front para consumir os endpoints e focos de calor <br> - criar o serviço para consumir os endpoints area queimada <br> - Criar o serviço para consumir os endpoinst risco de fogo <br> - Integrar o serviçoes aos charts, fazendo com que use das funções fetch para carregar os dados com base nos filtros |
| Testar a conexao e verificar a necessidade da criação de proxy no vite.config.ts, para redirecionar as requisições ao back-end ou o uso de biblioteca como cors |  

| **ATIVIDADES** | **PONTUAÇÃO (Planning Poker)** |
| --- | --- |
| **Conectar com o DB** | 8 |
| - Instalar pacote `pg` | 2 |
| - Criar arquivo `.env` e configurar credenciais | 3 |
| - Criar conexão utilizando `pg` no arquivo `db.ts` | 3 |
| **Criar API com Express** | 13 |
| - Criar `index.ts` para iniciar o servidor | 5 |
| - Configurar conexão com o DB | 3 |
| - Criar rota de teste para validar a conexão | 3 |
| - Adicionar script `start` no `package.json` | 2 |
| **Criar os endpoints no back-end** | 21 |
| - Criar arquivo `routes.ts` para definir rotas | 5 |
| - Implementar endpoint `GET` para focos de calor | 5 |
| - Implementar endpoint `GET` para áreas queimadas | 5 |
| - Implementar endpoint `GET` para risco de fogo | 6 |
| **Criar os Serviços** | 21 |
| - Criar serviço para focos de calor (`getAll` e filtros) | 7 |
| - Criar serviço para áreas queimadas (`getAll` e filtros) | 7 |
| - Criar serviço para risco de fogo (`getAll` e filtros) | 7 |
| **Implementar os controladores** | 13 |
| - Criar controlador para focos de calor | 4 |
| - Criar controlador para áreas queimadas | 4 |
| - Criar controlador para risco de fogo | 5 |
| - Atualizar rotas no `routes.ts` para usar controladores | 3 |
| **Criar modal de pesquisa (como componente React)** | 13 |
| - Criar componente `SearchModal.tsx` | 5 |
| - Adicionar select para bioma | 3 |
| - Adicionar inputs para estado e município | 3 |
| - Adicionar botão de submit | 2 |
| - Adicionar botão de seleção manual de área | 3 |
| **Criar componentes React para página de gráficos** | 21 |
| - Instalar e configurar biblioteca `Recharts` | 5 |
| - Criar contexto para filtragem e exibição dos gráficos | 7 |
| - Adicionar gráficos de barra com `Recharts` | 5 |
| - Exibir filtros ativos usando contexto | 4 |
| **Conectar front-back** | 21 |
| - Criar `api.ts` com funções `fetch` e definir URL base | 7 |
| - Criar serviço para consumir endpoints de focos de calor | 5 |
| - Criar serviço para consumir endpoints de áreas queimadas | 5 |
| - Criar serviço para consumir endpoints de risco de fogo | 4 |
| - Integrar serviços aos gráficos para carregar dados filtrados | 5 |
| **Testar a conexão e verificar necessidade de proxy/cors** | 5 |
| - Testar comunicação entre front e back | 3 |
| - Configurar proxy no `vite.config.ts` caso necessário | 2 |

