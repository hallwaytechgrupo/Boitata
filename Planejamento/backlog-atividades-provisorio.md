
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
<br>
<br>
<br>

**| | | | | rascunho | | | | |**

5. Implementar o PostGIS. (5)
6. inserção dos shapefiles dos estados. (2)
8. inserção dos shapefiles dos biomas. (2) 
9. Criar método Curl para obter os dados do banco de queimadas do INPE. (8)
10. Criar importador CSV para inserir os dados no banco de dados normalizado. (13)


## RF01

- **Preparar o Ambiente de Desenvolvimento**: 
  - Configurar o ambiente com Node.js, React (TypeScript) e PostgreSQL. (1)
  - Instalar dependências necessárias, como `pg` para comunicação com o banco. (1)
- **Configurar o Banco de Dados**:
  - Criar a tabela `focos_calor` no PostgreSQL com os campos apropriados (estado, número de focos, coordenadas geográficas, etc.). (2)
  - Configurar o PostGIS para suporte a dados geoespaciais. (1)

### **2. Back-End**
- **Implementar API REST**:
  - Criar um servidor Node.js para gerenciar as requisições. (8)
  - Criar endpoints como: (5)
    - `GET /focos-calor`: Retorna os focos de calor organizados por estado.
    - `GET /focos-calor/:estado`: Retorna os focos de calor filtrados por estado específico.
  - Testar a conexão com o PostgreSQL e configurar queries SQL para obter os dados. (5)

### **3. Front-End**
- **Criar Interface de Usuáo**
  - Gerar grafico dinamico, para o estado selecionado. (13) 

- **Chamada à API**:
  - Implementar funções para consumir os endpoints do back-end. (5)
  - Adicionar funcionalidades de filtro por estado e tratamento de erros (como mensagens para dados inexistentes). (13)

- **UX e Responsividade**:
  - Garantir que a tabela funcione bem em diferentes tamanhos de tela. (8)

-----

## **RF02**

### **1. Configuração Inicial** 
- Ajustar a tabela `focos_calor` no PostgreSQL para incluir um campo de bioma (se já não existir). **(5)**  
- Popular os dados do BDQueimadas, organizados por bioma e verificados quanto à integridade e qualidade. **(8)**  

### **2. Back-End**
- Criar endpoints para gerenciar e fornecer dados:  
  - `GET /focos-calor/biomas`: Retorna focos de calor agrupados por bioma. **(5)**  
  - `GET /focos-calor/biomas/:bioma`: Retorna dados para um bioma específico. **(5)**  
- Desenvolver consultas SQL otimizadas para agrupar e filtrar os focos de calor por bioma, utilizando funções do PostGIS quando necessário. **(8)**  

-----

### **3. Front-End**
- Criar grafico dinamico com base no protótipo aprovado no Figma, exibindo dados de focos por bioma. **(8)**  
- Adicionar filtro para selecionar biomas específicos (como Amazônia ou Cerrado). **(5)**  
- Implementar chamadas aos endpoints do back-end e renderizar os dados retornados. **(5)**  
 
-----

## **RF03**

### **1. Configuração Inicial**
- Adicionar ao banco de dados um modelo de dados que suporte o risco de fogo por estado. **(5)**  
- Popular os dados no BDQueimadas, categorizados por estado e nível de risco. **(8)**  

### **2. Back-End**
- Criar endpoints:  
  - `GET /risco-fogo/estados`: Retorna risco de fogo categorizado por estado. **(5)**  
  - `GET /risco-fogo/estados/:estado`: Retorna detalhes do risco de fogo de um estado específico. **(5)**  
- Implementar consultas SQL otimizadas para filtrar e categorizar os dados de risco por estado. **(8)**  

### **3. Front-End**
- Criar grafico para exibir os dados do risco de fogo por estado. **(8)**  
- Consumir os endpoints do back-end e renderizar os dados retornados. **(5)**  

### **4. Documentação**
- Documentar a estrutura de banco, consultas SQL e detalhes dos endpoints. **(3)**  
 

-----

## **RF04**

### **Back-End**
- Criar endpoints:  **(5)**
  - `GET /risco-fogo/biomas`: Retorna os riscos de fogo categorizados por bioma. 
  - `GET /risco-fogo/biomas/:bioma`: Retorna detalhes de um bioma específico. 
- Configurar consultas SQL para organizar os dados por bioma. **(8)**  

### **Front-End**
- Implementar interface com base no protótipo do Figma para exibicao dos risco de fogo por bioma no mapa. **(5)**  
- Exibir dados de riscos de fogo por bioma em grafico responsivo. **(8)**  

-----


## **RF05 - Área queimada por estado**

### **Configuração**
- Configurar a tabela do PostgreSQL para armazenar a extensão da área queimada agrupada por estado. **(5)**  


### **Back-End**
- Criar endpoints:  **(5)**
  - `GET /areas-queimadas/estados`: Retorna as áreas queimadas agrupadas por estado. 
  - `GET /areas-queimadas/estados/:estado`: Detalha os dados de um estado específico.  
- Implementar queries SQL para calcular e organizar as áreas queimadas. **(8)**  

### **Front-End**
- Adicionar gráficos para representação visual da evolução das areas queimadas por estado em relação temporal. **(13)**  

-----

## **RF06 - Área queimada por bioma**

### **Configuração**
- Garantir que a tabela `areas_queimadas` no PostgreSQL contemple o agrupamento por bioma. **(5)**  

### **Back-End**
- Criar endpoints:  **(5)**
  - `GET /areas-queimadas/biomas`: Lista áreas queimadas agrupadas por bioma. 
  - `GET /areas-queimadas/biomas/:bioma`: Exibe detalhes específicos de cada bioma. 
- Utilizar consultas SQL adequadas para obter dados confiáveis e relevantes. **(8)**  

### **Front-End**
- Exibir os dados organizados de forma clara em gráficos dinâmicos. **(13)**  

-----

## **RF07 - Gráficos de focos de calor por estado e bioma**

### **Configuração**
- Decidir entre Chart.js e D3.js para implementação dos gráficos. **(2)**  

### **Back-End**
- Criar endpoints:  **(5)**
  - `GET /graficos/focos-calor/estados`: Dados de focos de calor por estado. 
  - `GET /graficos/focos-calor/biomas`: Dados de focos de calor por bioma. 
- Implementar consultas SQL para filtrar e agrupar os dados necessários. **(8)**  

### **Front-End**
- Utilizar a biblioteca definida (Chart.js ou D3.js) para criar gráficos de linha e barras. **(13)**  
 
-----

## **RF08 - Gráficos de risco de fogo por estado e bioma**

### **Configuração**
- Configurar dependências para a biblioteca de gráficos escolhida. **(3)**  

### **Back-End**
- Criar endpoints:  **(5)**
  - `GET /graficos/risco-fogo/estados`: Dados de risco de fogo por estado.  
  - `GET /graficos/risco-fogo/biomas`: Dados de risco de fogo por bioma. 
- Desenvolver consultas SQL para organizar os dados em agrupamentos relevantes. **(8)**  

### **Front-End**
- Projetar gráficos de linha para tendências utilizando as bibliotecas selecionadas. **(13)**  


-----

## **RF09 - Gráficos de área queimada por estado e bioma**

### **Configuração**
- Validar que os dados históricos de área queimada estão categorizados no banco por estado e bioma. **(5)**   

### **Back-End**
- Criar endpoints:  **(5)**
  - `GET /graficos/areas-queimadas/estados`: Dados de áreas queimadas por estado.   
  - `GET /graficos/areas-queimadas/biomas`: Dados de áreas queimadas por bioma. 
- Configurar consultas SQL para agrupar e filtrar os dados com base nos critérios. **(8)**  

### **Front-End**
- Implementar gráficos de linha para análise temporal. **(13)**  
- Assegurar a responsividade e interação nos gráficos criados. **(8)**  

-----


## **RF10 - Restringir as consultas por intervalo de tempo**

### **Back-End**
- Criar o endpoint:  **(8)**
  - `GET /focos-calor/filtrar`: Aceita parâmetros de `data_inicio` e `data_fim` no formato YYYY-MM-DD.  
- Implementar validações de intervalo e tratamento de erros para datas inválidas.  

### **Front-End**
- Desenvolver a interface de seleção de intervalos de tempo com base no protótipo do Figma. **(5)**  
- Atualizar a exibição dos dados após aplicação do filtro, garantindo responsividade. **(8)**  

-----

## **RF11 - Identificar os meses com maior risco de fogo**

### **Configuração**
- Validar que os dados de risco de fogo possuem informações de data formatadas corretamente no banco, ou corrigir se necessario. **(5)**  


### **Back-End**
- Criar o endpoint:  **(8)**
  - `GET /risco-fogo/meses-maiores-riscos`: Retorna os meses com maior risco de fogo, agrupados por região ou bioma.   
- Desenvolver lógica de análise para identificar os meses críticos com base nos dados históricos. **(13)**

### **Front-End**
- Criar uma visualização clara e intuitiva dos meses identificados, utilizando gráficos. **(8)**  


## RF12 - Associação entre risco de fogo e área queimada

### **Back-End**
- Criar endpoints:  **(8)**
  - `GET /associacao/risco-area`: Retorna dados sobre correlação entre risco de fogo e áreas queimadas.  
  - `GET /associacao/risco-area/mapa`: Fornece dados geoespaciais para visualizações de mapas de calor.  
- Implementar métodos estatísticos para calcular a correlação entre os dois conjuntos de dados. **(13)**  

### **Front-End**
- Sobrescrever o mapa de focos de calor e aresas queimadas para gerar esclarecimento visual ao usuario assim conseguindo determinar a realação entre elas. **(13)**  



## **RF13 - Fazer diagramas UML**

### **Documentação**
- Criar diagramas:  
  - **Casos de Uso**: Cobrir todos os RFs do backlog. **(5)**  
  - **Classe**: Incluir entidades principais, como `FocoCalor` e `Bioma`. **(5)**  
  - **Sequência**: Representar o fluxo de filtragem por data. **(5)**  
 **garantindo sempre que o diagramas foram validados com o professor Andre

-----

## **RF14 - Junção de Tabelas**

### **Configuração**
- Validar e documentar o modelo de dados existente, incluindo tabelas e relacionamentos. **(3)**    

### **Back-End**
- Confirmar se as consultas SQL combinam informações de multiplas tabelas , utiliando junções como 'inner join' e 'left join' **(2)**  

-----


## **RF15 - Funções Agrupadoras**

### **Back-End**
- Validar o uso de funções agrupadoras como 'sum', 'avg', 'count' e similares durante o desenvolvimento **(2)**  


-----

## RF16 - Stored Procedures

- Garantir que o DataBase contenha stored procedures que encapsulem lógicas SQL reutilizáveis, como cálculos e operações complexas. **(3)**


-----

## RF17 - Triggers

- Garantir que as Triggers para insersao de dados estejam configuradas corretamente e estejam presentes no sistema de gerencimando do DataBase. **(5)**

-----

## RF18 - Setup do Banco de Dados

- Confirmar o setup do DataBase, se atente as normalizacoes necessarias e se as tabelas estao bem configuradas e relacionadas entre si, se o modelo e o banco respeitam suas limitacoes e se representam mutuamente sem grandes divergencias. **(5)**

-----
