# Documentação do Banco de Dados "db_boitata"

## Estruturação do DataBase:
Utiliando o PostgreSQL como SGBD para gerenciar o banco de dados vinculado a aplicação Boitata Heat Sentinel.
- Instalar o SGBD postgreSQL(versão 17)
- Criar banco de dados de nome db_boitata.
- Instalar a extenção postGis, propria para a respectiva versão (pode ser encontrada em   [`postGis on postgreSQL.org`](https://www.postgresql.org/ftp/postgis/))

**configurar configurar a extenção postgis**
- executar o arquivo dvCreate.sql via ``psql shel`` utilizando:
    - abra o ``psql shell`` e faça o login com o superusuario cadastrado durante a instalação do ``postgreSQL``
    - digitar o comando ``\i <caminho_do_arquivo_dbCreate.sql>;``

---
## Tabelas e Estrutura

### *1. tb_biomas*
- *Descrição:* Guarda as informações de polígonos dos biomas.
- *Colunas:*
  - id_bioma (int, PK): Identificador único do bioma.
  - bioma (varchar, NOT NULL): Nome do bioma.
  - geometry (geometry(multipolygon), NOT NULL): Representação geográfica do bioma.

---

### *2. tb_estados*
- *Descrição:* Guarda informações e os polígonos dos estados brasileiros.
- *Colunas:*
  - id_estado (int, PK): Identificador único do estado.
  - estado (varchar, NOT NULL): Nome do estado.
  - geometry (geometry(multipolygon), NOT NULL): Representação geográfica do estado.

---

### *3. tb_municipios*
- *Descrição:* Contém informações sobre os municípios.
- *Colunas:*
  - id_municipio (int, PK): Identificador único do município.
  - estado_id (int, NOT NULL): Identificador do estado relacionado.
  - municipio (varchar, NOT NULL): Nome do município.
  - geometry (geometry(multipolygon), NOT NULL): Representação geográfica do município.

---

### *4. tb_focos_calor*
- *Descrição:* Registra os focos de calor detectados.
- *Colunas:*
  - id_foco (UUID, PK): Identificador único do foco de calor.
  - localizacao (geometry(multipolygon,4326)).
  - data_hora_gmt (timestamp, NOT NULL): Data e hora do registro no horário GMT.
  - id_municipio (int): Identificador do município relacionado.
  - id_bioma (int): Identificador do bioma relacionado.
  - satelite (varchar, NOT NULL): Satélite que registrou o foco.
  - frp (numeric(3,2)),
  - risco_fogo (numeric(3,2)): Nível de risco de fogo.

---

### *5. tb_area_queimada*
- *Descrição:* Contém as áreas queimadas por mês de referência.
- *Colunas:*
  - id_area_queimada (serial, PK): Identificador único da área queimada.
  - mes_referencia (date, NOT NULL): Mês de referência (formato yyyy-mm-dd), padronizado com o dia como "01".
  - geometry (geometry(multipolygon), NOT NULL): Representação geográfica da área queimada.

---

## Relacionamentos
- *Descrição:* Atendendo as normalições do sistema de banco de dados relacional, os relacionamentos vinculam os dados de diferentes tabelas, facilitando a agilizando os processos de pesquisa e evitando redundancias no sistema e consequente adição de dados repetidos no banco de dados.

- "tb_biomas"."id_bioma" refere-se a "tb_focos_calor"."bioma_id".
- "tb_municipios"."id_municipio" refere-se a "tb_focos_calor"."municipio_id".
- "tb_estados"."id_estado" refere-se a "tb_municipios"."estado_id".

---

## Indices Espaciais


**1. idx_tb_estados_geometry**
- *Descrição:* Índice espacial criado na tabela `tb_estados` para otimizar consultas geográficas.
---

**2. idx_tb_municipios_geometry**
- *Descrição:* Índice espacial criado na tabela `tb_municipios` para aprimorar a performance de consultas espaciais.

---

**3. idx_tb_area_queimada_geometry**
- *Descrição:* Índice espacial aplicado à tabela `tb_area_queimada`, permitindo buscas mais rápidas sobre áreas queimadas.


---

## Observações
- **Constraint da tabela tb_area_queimada:** O campo mes_referencia deve seguir o formato yyyy-mm-dd, com o dia padronizado em "01". Isso reflete o mês anterior à publicação do dado.

---
