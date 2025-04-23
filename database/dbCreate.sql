--criação do banco de dados
CREATE DATABASE db_boitata;

--acessar database
\c db_boitata;

-- PostGIS Extension (certifique-se de que a extensão já não foi criada)
CREATE EXTENSION IF NOT EXISTS postgis;

-- LEIA Insert-shp.md antes de seguir com os comandos daqui para baixo

-- Criação das Tabelas
CREATE TABLE tb_estados (
    id_estado int PRIMARY KEY,
    estado VARCHAR(255),
    geometry GEOMETRY(MultiPolygon, 4326) -- SRID 4326 para latitude/longitude
);

CREATE TABLE tb_municipios (
    id_municipio int PRIMARY KEY,
    municipio VARCHAR(255),
    id_estado INT REFERENCES tb_estados(id_estado),
    geometry GEOMETRY(MultiPolygon, 4326)
    -- A coluna id_bioma foi removida
);

CREATE TABLE tb_biomas (
    id_bioma int PRIMARY KEY,
    bioma VARCHAR(255),
    geometry GEOMETRY(MultiPolygon, 4326)
);

CREATE TABLE tb_focos_calor (
    id_foco UUID PRIMARY KEY,
    localizacao GEOMETRY(Point, 4326),
    data_hora TIMESTAMP,
    satelite VARCHAR(255),
    id_municipio INT REFERENCES tb_municipios(id_municipio),
    id_bioma int REFERENCES tb_biomas(id_bioma),
    frp numeric(9,2),
    risco_fogo numeric(9,2)
);

CREATE TABLE tb_area_queimada (
    id_area_queimada SERIAL PRIMARY KEY,
    date varchar(6),
    geometry GEOMETRY(MultiPolygon, 4326)
);



-- Índices Espacial
CREATE INDEX idx_tb_estados_geometry ON tb_estados USING GIST (geometry);
CREATE INDEX idx_tb_municipios_geometry ON tb_municipios USING GIST (geometry);
CREATE INDEX idx_tb_area_queimada_geometry ON tb_area_queimada USING GIST (geometry);
CREATE INDEX idx_tb_focos_calor_localizacao ON tb_focos_calor USING GIST (localizacao);
CREATE INDEX idx_tb_biomas_geometry ON tb_biomas USING GIST (geometry);

-- Inserir dados da tabela bioma para tb_biomas
INSERT INTO tb_biomas (id_bioma, bioma, geometry)
SELECT 
    cd_bioma AS id_bioma,
    bioma,
    geom AS geometry
FROM bioma
WHERE cd_bioma IS NOT NULL;

select bioma from tb_biomas;

-- Inserir dados da tabela estado para tb_estados
INSERT INTO tb_estados (id_estado, estado, geometry)
SELECT 
    CAST(cd_uf AS integer) AS id_estado,
    nm_uf AS estado,
    geom AS geometry
FROM estado
WHERE cd_uf ~ '^[0-9]+$';

select estado from tb_estados;

-- Inserir dados da tabela municipio para tb_municipios
INSERT INTO tb_municipios (id_municipio, municipio, id_estado, geometry)
SELECT 
    CAST(cd_mun AS integer) AS id_municipio,
    nm_mun AS municipio,
    CAST(cd_uf AS integer) AS id_estado,
    geom AS geometry
FROM municipio
WHERE cd_mun ~ '^[0-9]+$' AND cd_uf ~ '^[0-9]+$';

-- Verificar contagem de registros
SELECT 'Biomas' AS tabela, COUNT(*) FROM tb_biomas
UNION ALL
SELECT 'Estados', COUNT(*) FROM tb_estados
UNION ALL
SELECT 'Municípios', COUNT(*) FROM tb_municipios;

-- Verificar alguns registros de exemplo
SELECT * FROM tb_biomas LIMIT 5;
SELECT * FROM tb_estados LIMIT 5;
SELECT * FROM tb_municipios LIMIT 5;

-- analizar e verificar formato para sprint 2 creação de taela adicional, para importação dos
-- pontos de calor e area queimada, para receber os dados como vem do DBqueimadas, e transportar para 
-- as tabelas normalizadas originais do banco