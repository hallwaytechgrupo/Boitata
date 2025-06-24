-- Transformar em procedure, mas funciona temporariamente para inserir os focos de calor

-- IMPORTADOR
DROP TABLE IF EXISTS temp_focos_calor;

CREATE TEMP TABLE temp_focos_calor (
    id TEXT UNIQUE,
    lat NUMERIC,
    lon NUMERIC,
    data_hora_gmt TIMESTAMP,
    satelite TEXT,
    municipio TEXT,
    estado TEXT,
    pais TEXT,
    municipio_id INTEGER,
    estado_id INTEGER,
    pais_id INTEGER,
    numero_dias_sem_chuva NUMERIC,
    precipitacao NUMERIC,
    risco_fogo NUMERIC,
    bioma TEXT,
    frp NUMERIC
);

-- Execute no PSQL
\copy temp_focos_calor FROM 'C:/focos_v2.csv' DELIMITER ',' CSV HEADER ENCODING 'UTF8';

INSERT INTO tb_focos_calor (
    id_foco, localizacao, data_hora, satelite, 
    id_municipio, id_bioma, frp, risco_fogo
)
SELECT 
    t.id::UUID,
    ST_SetSRID(ST_MakePoint(t.lon, t.lat), 4326),
    t.data_hora_gmt,
    t.satelite,
    t.municipio_id,
    b.id_bioma,
    t.frp,
    t.risco_fogo
FROM temp_focos_calor t
JOIN tb_biomas b ON t.bioma = b.bioma
ON CONFLICT (id_foco) DO NOTHING;