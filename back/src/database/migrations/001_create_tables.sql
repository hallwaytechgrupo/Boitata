
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS tb_estados (
    id_estado int PRIMARY KEY,
    estado VARCHAR(255),
    geometry GEOMETRY(MultiPolygon, 4326)
);

CREATE TABLE IF NOT EXISTS tb_municipios (
    id_municipio int PRIMARY KEY,
    municipio VARCHAR(255),
    id_estado INT REFERENCES tb_estados(id_estado),
    geometry GEOMETRY(MultiPolygon, 4326)
);

CREATE TABLE IF NOT EXISTS tb_biomas (
    id_bioma int PRIMARY KEY,
    bioma VARCHAR(255),
    geometry GEOMETRY(MultiPolygon, 4326)
);

CREATE TABLE IF NOT EXISTS tb_focos_calor (
    id_foco UUID PRIMARY KEY,
    localizacao GEOMETRY(Point, 4326),
    data_hora TIMESTAMP,
    satelite VARCHAR(255),
    id_municipio INT REFERENCES tb_municipios(id_municipio),
    id_bioma int REFERENCES tb_biomas(id_bioma),
    frp numeric(9,2),
    risco_fogo numeric(9,2)
);

CREATE TABLE IF NOT EXISTS tb_area_queimada (
    id_area_queimada SERIAL PRIMARY KEY,
    date varchar(6),
    geometry GEOMETRY(MultiPolygon, 4326)
);