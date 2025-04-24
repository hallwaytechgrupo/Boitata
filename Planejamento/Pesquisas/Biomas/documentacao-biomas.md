# Guia: Inserindo Shapefiles no PostGIS com DBeaver

## O que é um Shapefile?
Um shapefile é um formato padrão em Sistemas de Informação Geográfica (GIS) para armazenar dados espaciais, como pontos, linhas ou polígonos. Ele é composto por vários arquivos que funcionam juntos, sendo os principais:
- **.SHP**: Contém as geometrias, ou seja, as formas que aparecem no mapa (ex.: contorno de uma região ou posição de um evento).
- **.DBF**: Um arquivo de banco de dados (formato dBase) que armazena os atributos em formato tabular (ex.: "nome = São Paulo", "população = 12 milhões").
- **.SHX**: Um índice que conecta o .SHP ao .DBF, garantindo que cada geometria tenha seus atributos correspondentes.

O .SHP e o .DBF são interdependentes: o .SHP define "onde" algo está, e o .DBF descreve "o que" é.
Por exemplo, num shapefile de cidades, o .SHP tem o contorno de Jacareí, e o .DBF traz "nome = Jacareí" e "estado = SP". No PostGIS, esses arquivos viram uma tabela com `geom` e atributos.

## Conjuntos e Subconjuntos
Pensar em shapefiles como conjuntos ajuda a entender sua estrutura:
- **Conjunto Shapefile**: O shapefile completo (ex.: "Cidades do Brasil") inclui .SHP, .DBF, .SHX, etc.
- **Subconjunto Geometria**: O .SHP, com as formas espaciais (ex.: contornos de cidades).
- **Subconjunto Atributos**: O .DBF, com os dados descritivos (ex.: nomes e populações).

Exemplo: o conjunto "Cidades do Brasil" tem subconjuntos como "Jacareí", cada um com sua geometria (.SHP) e atributos (.DBF). No PostGIS, isso vira uma tabela onde cada linha é um subconjunto.

## Configurando o PostGIS no DBeaver
Antes de inserir shapefiles, precisamos configurar a conexão com o PostGIS no DBeaver. Aqui está o passo a passo:

1. **Verifique o PostGIS no Banco**:
   - Certifique-se de que o PostGIS está instalado no PostgreSQL (ex.: via `apt-get install postgis` no Linux), ou para Windows basta baixar o instalador e clicar em next, next, concluir...
   - Conecte ao banco (ex.: `queimadas_db`) e ative a extensão:
     ```sql
     CREATE EXTENSION postgis;
     SELECT postgis_version(); -- Confirma a versão
     ```

2. **Crie a Conexão no DBeaver**:
   - Abra o DBeaver e clique em "Database" > "New Connection".
   - Escolha "PostgreSQL" e clique em "Next".
   - Preencha:
     - **Host**: `localhost` (ou IP do servidor).
     - **Port**: `5432`.
     - **Database**: Nome do banco (ex.: `queimadas_db`).
     - **Username**: `postgres` (ou seu usuário).
     - **Password**: Sua senha.
   - Clique em "Test Connection". Se funcionar, vá em frente.

3. **Finalize**:
   - Clique em "Finish" para salvar.
   - Abra a conexão na árvore à esquerda.
   - Teste com:
     ```sql
     SELECT ST_GeomFromText('POINT(-45.966720416533 -23.295111785786105)', 4326);
     ```
     Se retornar a geometria da FATEC, o PostGIS está ativo.

O DBeaver usa o driver padrão do PostgreSQL e reconhece o PostGIS automaticamente, desde que a extensão esteja habilitada.

## Inserindo o Shapefile de Biomas no PostGIS

Agora, vamos inserir o shapefile de Biomas (`biomas.shp` e `biomas.dbf`) no PostGIS. O arquivo está localizado na pasta `/Planejamento/Pesquisas/Shapefiles/biomas`.

### Passo a Passo no PostGIS (GUI - Windows)
1. **Conecte ao PostGIS**:
   - Use a conexão configurada previamente.

2. **Importe o Shapefile**:
   - Clique em `Add File`.
   - Vá até a pasta que estão os arquivos, e selecione o .`shp`.

3. **Configure**:
   - **SRID**: Use `4326` (padrão GPS).
   - **Nome da tabela**: Insira um nome descritivo, como `biomas`.

4. **Finalize**:
   - Clique em `Import`.
   - Espere concluir o processo.
   - Após a importação, abra a tabela no DBeaver para verificar:
     - A coluna `geom` deve conter as formas geométricas.
     - As colunas do `.DBF` devem estar presentes como atributos.

### Alternativa no Terminal (shp2pgsql)
Se preferir usar o terminal, siga os passos abaixo:

1. **Comando para Importar**:
   - Navegue até a pasta `shapefiles` no terminal.
   - Execute o comando abaixo para importar o shapefile `biomas.shp`:
     ```bash
     shp2pgsql -I -s 4326 biomas.shp biomas | psql -U postgres -d queimadas_db
     ```
   - Lembre-se que -U é p nome do usuário e o -d é o nome do database.
   - Esse comando:
     - Cria a tabela `biomas` no banco de dados.
     - Adiciona um índice espacial automaticamente.

2. **Verifique a Importação**:
   - No terminal ou no DBeaver, execute a consulta SQL:
     ```sql
     SELECT bioma as nome, ST_GeometryType(geom)
     FROM bioma
     LIMIT 5;;
     ```
   - Isso retornará os nomes dos biomas e o tipo de geometria armazenada.

### Observação
Certifique-se de que o PostGIS está configurado corretamente no banco de dados e que a extensão está habilitada:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
SELECT postgis_version();
```