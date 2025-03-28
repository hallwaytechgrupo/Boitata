## RF0

1. Criar protótipo no Figma.
2. Definir o CSS para o projeto.
3. Modelar o banco de dados.
4. Criar o banco de dados normalizado no PostgreSQL.
5. Implementar o PostGIS.
6. Criar tabelas para armazenar os shapefiles dos estados.
7. Pesquisar e obter os shapefiles dos biomas.
8. Criar tabelas para armazenar os shapefiles dos biomas.
9. Criar método Curl para obter os dados do banco de queimadas do INPE.
10. Criar importador CSV para inserir os dados no banco de dados normalizado.
11. Pesquisar melhores práticas e técnicas para documentação de APIs e documentações técnicas relacionadas.

-----

## RF01

### **1. Configuração Inicial**
- **Preparar o Ambiente de Desenvolvimento**:
  - Configurar o ambiente com Node.js, React (TypeScript) e PostgreSQL.
  - Instalar dependências necessárias, como `pg` para comunicação com o banco.
- **Configurar o Banco de Dados**:
  - Criar a tabela `focos_calor` no PostgreSQL com os campos apropriados (estado, número de focos, coordenadas geográficas, etc.).
  - Configurar o PostGIS para suporte a dados geoespaciais.

### **2. Back-End**
- **Implementar API REST**:
  - Criar um servidor Node.js para gerenciar as requisições.
  - Criar endpoints como:
    - `GET /focos-calor`: Retorna os focos de calor organizados por estado.
    - `GET /focos-calor/:estado`: Retorna os focos de calor filtrados por estado específico.
  - Testar a conexão com o PostgreSQL e configurar queries SQL para obter os dados.
- **Lógica de Dados**:
  - Implementar consultas SQL eficientes para calcular e agrupar os focos por estado.
  - Caso necessário, usar funções PostGIS para manipulação de dados geoespaciais.

### **3. Front-End**
- **Criar Interface de Usuário**:
  - Desenvolver o protótipo aprovado no Figma.
  - Criar uma tabela responsiva para exibir os dados organizados por estado.
- **Chamada à API**:
  - Implementar funções para consumir os endpoints do back-end.
  - Adicionar funcionalidades de filtro por estado e tratamento de erros (como mensagens para dados inexistentes).
- **UX e Responsividade**:
  - Garantir que a tabela funcione bem em diferentes tamanhos de tela.

-----

## RF02

### **1. Configuração Inicial**
- **Preparar o Ambiente de Desenvolvimento**:
  - Certificar que Node.js, React (TypeScript) e PostgreSQL estão configurados corretamente.
  - Garantir que o PostGIS está habilitado para suporte a dados geoespaciais.
- **Configurar o Banco de Dados**:
  - Ajustar a tabela `focos_calor` no PostgreSQL para incluir um campo de bioma (se já não existir).
  - Popular os dados do BDQueimadas, organizados por bioma e verificados quanto à integridade e qualidade.

### **2. Back-End**
- **Implementar API REST**:
  - Criar endpoints para gerenciar e fornecer dados:
    - `GET /focos-calor/biomas`: Retorna focos de calor agrupados por bioma.
    - `GET /focos-calor/biomas/:bioma`: Retorna dados para um bioma específico.
  - Desenvolver consultas SQL otimizadas para agrupar e filtrar os focos de calor por bioma, utilizando, se necessário, funções do PostGIS.
- **Testar a API**:
  - Verificar a funcionalidade dos endpoints com dados reais de teste.

### **3. Front-End**
- **Criar Interface de Usuário**:
  - Basear-se no protótipo aprovado no Figma para criar uma tabela responsiva que exiba os dados de focos por bioma.
  - Adicionar um seletor ou filtro para escolher biomas específicos (como Amazônia ou Cerrado).
- **Integração com API**:
  - Implementar chamadas aos endpoints do back-end e renderizar os dados retornados.
  - Garantir feedback apropriado para casos como ausência de dados.
- **Aprimoramento de UX**:
  - Garantir usabilidade e responsividade em diferentes tamanhos de tela e dispositivos.

### **4. Documentação**
- **Documentação Técnica**:
  - Registrar detalhes do modelo de dados, consultas SQL e endpoints de API.
  - Documentar as dependências e instruções de configuração.
- **Documentação de Front-End**:
  - Explicar como consumir a API e renderizar os dados no React.

-----

## RF03

### **1. Configuração Inicial**
- **Preparar o Ambiente de Desenvolvimento**:
  - Garantir que o ambiente com Node.js, React (TypeScript) e PostgreSQL esteja configurado adequadamente.
  - Verificar a configuração do PostGIS para suporte a dados geoespaciais.
- **Configurar o Banco de Dados**:
  - Adicionar ao banco de dados um modelo de dados que suporte o risco de fogo por estado.
  - Verificar e popular os dados no BDQueimadas, categorizados por estado e nível de risco.

### **2. Back-End**
- **Implementar API REST**:
  - Criar endpoints para fornecer dados de risco de fogo:
    - `GET /risco-fogo/estados`: Retorna risco de fogo categorizado por estado.
    - `GET /risco-fogo/estados/:estado`: Retorna detalhes do risco de fogo de um estado específico.
  - Implementar consultas SQL otimizadas para filtrar e categorizar os dados de risco por estado.
- **Testar a API**:
  - Validar que os endpoints retornam dados precisos em diferentes cenários.

### **3. Front-End**
- **Desenvolver Interface do Usuário**:
  - Implementar a interface de acordo com o protótipo do Figma.
  - Criar uma tabela para exibir os dados do risco de fogo categorizados por estado.
  - Adicionar caixas de detalhes para informações adicionais de estados específicos.
- **Integração com API**:
  - Consumir os endpoints do back-end e renderizar os dados retornados.
- **Aprimorar Responsividade e Usabilidade**:
  - Certificar que a interface funcione bem em diferentes dispositivos e tamanhos de tela.

### **4. Documentação**
- **Documentação Técnica**:
  - Documentar a estrutura de banco, consultas SQL e detalhes dos endpoints.
- **Documentação do Front-End**:
  - Fornecer instruções sobre como consumir a API e integrar os dados.

-----

## RF04 - Risco de fogo por bioma

**Configuração**:
- Ajustar a tabela no PostgreSQL para incluir o campo de bioma, caso necessário.
- Preparar o ambiente de desenvolvimento com suporte a dados categorizados por bioma.

**Back-End**:
- Criar endpoints:
  - `GET /risco-fogo/biomas`: Retorna os riscos de fogo categorizados por bioma.
  - `GET /risco-fogo/biomas/:bioma`: Retorna detalhes de um bioma específico.
- Configurar consultas SQL otimizadas para organizar os dados por bioma.

**Front-End**:
- Implementar a interface com base no protótipo do Figma.
- Exibir os dados de riscos de fogo por bioma em uma tabela interativa e responsiva.

**Documentação**:
- Detalhar a estrutura de banco, SQL e APIs.
- Documentar os passos para exibição no front-end.

-----

## RF05 - Área queimada por estado

**Configuração**:
- Configurar a tabela do PostgreSQL para armazenar a extensão da área queimada agrupada por estado.
- Configurar o ambiente para desenvolver visualizações de dados.

**Back-End**:
- Criar endpoints:
  - `GET /areas-queimadas/estados`: Retorna as áreas queimadas agrupadas por estado.
  - `GET /areas-queimadas/estados/:estado`: Detalha os dados de um estado específico.
- Implementar queries SQL para calcular e organizar as áreas queimadas.

**Front-End**:
- Desenvolver uma interface de usuário intuitiva com tabelas que agrupem por estado.
- Adicionar gráficos ou mapas, se necessário, para representação visual.

**Documentação**:
- Documentar o modelo de dados, API e instruções para o front-end.
- Criar especificações para consumo de dados pelo React.

-----

## RF06 - Área queimada por bioma

**Configuração**:
- Garantir que a tabela `areas_queimadas` no PostgreSQL contemple o agrupamento por bioma.
- Validar os dados de biomas e áreas queimadas.

**Back-End**:
- Criar endpoints:
  - `GET /areas-queimadas/biomas`: Lista áreas queimadas agrupadas por bioma.
  - `GET /areas-queimadas/biomas/:bioma`: Exibe detalhes específicos de cada bioma.
- Utilizar consultas SQL adequadas para obter dados confiáveis e relevantes.

**Front-End**:
- Basear-se no protótipo do Figma para projetar uma interface atrativa.
- Exibir os dados organizados de forma clara em tabelas ou gráficos dinâmicos.

**Documentação**:
- Registrar detalhes das APIs e instruções para front-end.
- Criar guias técnicos para manutenção e integração da funcionalidade.

-----

## RF07 - Gráficos de focos de calor por estado e bioma

**Configuração**:
- Certificar que os dados históricos (estado, bioma, número de focos e data) estão organizados no PostgreSQL.
- Decidir entre Chart.js e D3.js para implementação dos gráficos.

**Back-End**:
- Criar endpoints:
  - `GET /graficos/focos-calor/estados`: Dados de focos de calor por estado.
  - `GET /graficos/focos-calor/biomas`: Dados de focos de calor por bioma.
- Implementar consultas SQL para filtrar e agrupar os dados necessários.

**Front-End**:
- Utilizar a biblioteca definida (Chart.js ou D3.js) para criar gráficos de linha e barras.
- Implementar a interação dos gráficos (tooltips, zoom, etc.) com base no protótipo do Figma.

**Documentação**:
- Registrar a estrutura dos endpoints e detalhar o uso da biblioteca de gráficos.
- Documentar a integração entre front-end e back-end para exibição dos gráficos.

-----

## RF08 - Gráficos de risco de fogo por estado e bioma

**Configuração**:
- Garantir que os dados históricos de risco de fogo estão disponíveis e categorizados no banco de dados.
- Configurar dependências para a biblioteca de gráficos escolhida.

**Back-End**:
- Criar endpoints:
  - `GET /graficos/risco-fogo/estados`: Dados de risco de fogo por estado.
  - `GET /graficos/risco-fogo/biomas`: Dados de risco de fogo por bioma.
- Desenvolver consultas SQL para organizar os dados em agrupamentos relevantes.

**Front-End**:
- Projetar gráficos de linha para tendências e de barras para comparações, conforme o protótipo.
- Adicionar funcionalidades interativas, como hover para exibir detalhes.

**Documentação**:
- Detalhar a implementação da API para gráficos de risco de fogo.
- Especificar os requisitos técnicos para a criação e integração dos gráficos.

-----

## RF09 - Gráficos de área queimada por estado e bioma

**Configuração**:
- Validar que os dados históricos de área queimada estão categorizados no banco por estado e bioma.
- Preparar o ambiente para utilização da biblioteca de gráficos selecionada.

**Back-End**:
- Criar endpoints:
  - `GET /graficos/areas-queimadas/estados`: Dados de áreas queimadas por estado.
  - `GET /graficos/areas-queimadas/biomas`: Dados de áreas queimadas por bioma.
- Configurar consultas SQL para agrupar e filtrar os dados com base nos critérios.

**Front-End**:
- Implementar gráficos de linha para análise temporal e gráficos de barras para comparações regionais.
- Assegurar a responsividade e interação nos gráficos criados.

**Documentação**:
- Documentar como os dados são consultados, processados e visualizados.
- Fornecer instruções detalhadas para manutenção e expansão dos gráficos.

-----

## RF10 - Restringir as consultas por intervalo de tempo

**Configuração**:
- Confirmar que os campos `data_inicio` e `data_fim` estão corretamente configurados na tabela `focos_calor`.
- Preparar o ambiente para validações de data e timezone.

**Back-End**:
- Criar o endpoint:
  - `GET /focos-calor/filtrar`: Aceita parâmetros de `data_inicio` e `data_fim` no formato YYYY-MM-DD.
- Implementar validações de intervalo e tratamento de erros para datas inválidas.

**Front-End**:
- Desenvolver a interface de seleção de intervalos de tempo com base no protótipo do Figma.
- Atualizar a exibição dos dados após aplicação do filtro, garantindo responsividade.

**Documentação**:
- Registrar a implementação do filtro por intervalo de tempo na API.
- Documentar os passos para uso e validação de datas no front-end.

-----

## RF11 - Identificar os meses com maior risco de fogo

**Configuração**:
- Validar que os dados de risco de fogo possuem informações de data formatadas corretamente no banco.
- Configurar dependências para análise estatística e manipulação de datas.

**Back-End**:
- Criar o endpoint:
  - `GET /risco-fogo/meses-maiores-riscos`: Retorna os meses com maior risco de fogo, agrupados por região ou bioma.
- Desenvolver lógica de análise para identificar os meses críticos com base nos dados históricos.

**Front-End**:
- Criar uma visualização clara e intuitiva dos meses identificados, utilizando tabelas ou gráficos.
- Adicionar interação para detalhamento das informações por mês e região.

**Documentação**:
- Detalhar a lógica de agrupamento de meses na API.
- Especificar a exibição dos dados no front-end e instruções para atualização.

-----

## RF12 - Associação entre risco de fogo e área queimada

**Configuração**:
- Verificar que os dados históricos de risco de fogo e área queimada estão integrados, com informações geográficas e temporais.
- Preparar o ambiente para utilização de bibliotecas de visualização geográfica.

**Back-End**:
- Criar endpoints:
  - `GET /associacao/risco-area`: Retorna dados sobre correlação entre risco de fogo e áreas queimadas.
  - `GET /associacao/risco-area/mapa`: Fornece dados geoespaciais para visualizações de mapas de calor.
- Implementar métodos estatísticos para calcular a correlação entre os dois conjuntos de dados.

**Front-End**:
- Desenvolver gráficos de dispersão e mapas de calor para exibir a associação entre risco de fogo e área queimada.
- Garantir que a interface seja responsiva e intuitiva.

**Documentação**:
- Documentar os cálculos de correlação e visualizações geográficas.
- Especificar os recursos utilizados para integração no front-end.

-----

## RF13 - Fazer diagramas UML

**Configuração**:
- Reunir todos os requisitos funcionais documentados no GitHub.
- Instalar o Astah Community para criação dos diagramas de casos de uso, classes e sequência.

**Back-End**:
- Não se aplica diretamente, já que a atividade envolve documentação.

**Front-End**:
- Não se aplica diretamente, já que a atividade envolve documentação.

**Documentação**:
- Criar diagramas:
  - **Casos de Uso**: Cobrir todos os RFs do backlog.
  - **Classe**: Incluir entidades principais, como `FocoCalor` e `Bioma`.
  - **Sequência**: Representar o fluxo de filtragem por data.
- Salvar os diagramas em arquivos apropriados e commitar no GitHub.
- Validar os diagramas com o Professor André.

-----

## RF14 - Junção de Tabelas

**Configuração**:
- Validar e documentar o modelo de dados existente, incluindo tabelas e relacionamentos.
- Garantir acesso ao banco via ferramentas como pgAdmin.

**Back-End**:
- Implementar consultas SQL que combinam informações de múltiplas tabelas, utilizando junções como `INNER JOIN` e `LEFT JOIN`.
- Testar as junções com diferentes conjuntos de dados.

**Front-End**:
- Não se aplica diretamente, mas o resultado pode ser consumido pelo front-end, se necessário.

**Documentação**:
- Documentar as consultas SQL criadas, detalhando os tipos de junções e os campos combinados.
- Validar os resultados das consultas com a Professora Lucineide.

-----

## RF15 - Funções Agrupadoras

**Configuração**:
- Validar que os dados necessários estão disponíveis no banco e configurados para cálculos estatísticos.

**Back-End**:
- Criar consultas SQL utilizando funções como `SUM`, `AVG`, `COUNT`, e `GROUP BY` para agregar dados de forma eficiente.
- Testar os resultados com diferentes cenários e volumes de dados.

**Front-End**:
- Não se aplica diretamente, mas o resultado agregado pode ser exibido no front-end, se necessário.

**Documentação**:
- Registrar as consultas SQL, incluindo exemplos de uso e explicações de cálculos.
- Validar os resultados com a Professora Lucineide e garantir que as consultas estão otimizadas.

-----

## RF16 - Stored Procedures

**Configuração**:
- Garantir que o modelo de dados no PostgreSQL está atualizado e adequado para as operações frequentes e complexas.
- Preparar o ambiente para criação e execução de stored procedures no banco.

**Back-End**:
- Implementar stored procedures que encapsulem lógicas SQL reutilizáveis, como cálculos e operações complexas.
- Testar as stored procedures com diferentes cenários para verificar funcionalidade e desempenho.

**Front-End**:
- Não se aplica diretamente, a menos que o front-end consuma as stored procedures via API.

**Documentação**:
- Registrar a implementação das stored procedures, incluindo exemplos de chamadas e instruções de uso.
- Validar o código SQL com a Professora Lucineide e garantir que a documentação esteja clara.

-----

## RF17 - Triggers

**Configuração**:
- Validar que o modelo de dados inclui os eventos necessários para criação de triggers.
- Preparar o ambiente para desenvolvimento e teste das triggers no PostgreSQL.

**Back-End**:
- Criar triggers que respondam a eventos críticos, como inserções, atualizações ou exclusões.
- Garantir que as triggers mantêm a integridade dos dados e otimizar seu desempenho.

**Front-End**:
- Não se aplica diretamente, mas o resultado das triggers pode influenciar nos dados exibidos.

**Documentação**:
- Documentar as triggers criadas, detalhando os eventos associados e suas ações.
- Validar o funcionamento das triggers com a Professora Lucineide e registrar os resultados.

-----

## RF18 - Setup do Banco de Dados

**Configuração**:
- Criar o banco de dados `queimadas_db` no PostgreSQL.
- Criar as tabelas `focos_calor`, `risco_fogo` e `area_queimada` com seus campos e relacionamentos.

**Back-End**:
- Desenvolver um script SQL inicial (`/backend/sql/setup.sql`) para configuração automatizada do banco.
- Verificar a conexão do sistema back-end com o banco configurado.

**Front-End**:
- Não se aplica diretamente, mas o setup do banco permitirá a integração de dados futuros.

**Documentação**:
- Detalhar o setup do banco, incluindo tabelas, relacionamentos e scripts SQL.
- Validar o processo com o Scrum Master e garantir que o setup atenda às necessidades da equipe.

-----
