--criação do banco de dados
CREATE DATABASE db_boitata;

--acessar database
\c db_boitata;

-- PostGIS Extension (certifique-se de que a extensão já não foi criada)
CREATE EXTENSION IF NOT EXISTS postgis;

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
    frp numeric(3,2),
    risco_fogo VARCHAR(255)
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



-- analizar e verificar formato para sprint 2 creação de taela adicional, para importação dos
-- pontos de calor e area queimada, para receber os dados como vem do DBqueimadas, e transportar para 
-- as tabelas normalizadas originais do banco