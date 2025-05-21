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
    id_area_queimada int PRIMARY KEY,
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


-- View Focos de Calor por Estado
CREATE OR REPLACE FUNCTION get_focos_geojson(
    p_estado_id integer,
    p_horas_intervalo integer DEFAULT 168
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    resultado jsonb;
BEGIN
    SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
            jsonb_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(fc.localizacao)::jsonb,
                'properties', jsonb_build_object(
                    'id', fc.id_foco,
                    'data', TO_CHAR(fc.data_hora, 'DD/MM/YYYY HH24:MI'),
                    'municipio', m.municipio,
                    'frp', fc.frp,
                    'risco', fc.risco_fogo,
                    'satelite', fc.satelite,
                    'estado', e.estado
                )
            )
        )
    ) INTO resultado
    FROM 
        tb_focos_calor fc
    JOIN 
        tb_municipios m ON fc.id_municipio = m.id_municipio
    JOIN
        tb_estados e ON m.id_estado = e.id_estado
    WHERE 
        m.id_estado = p_estado_id
        AND fc.data_hora >= (CURRENT_TIMESTAMP - (p_horas_intervalo || ' hours')::interval);
    
    RETURN resultado;
END;
$$;

CREATE INDEX IF NOT EXISTS idx_tb_focos_data_hora ON tb_focos_calor (data_hora);
CREATE INDEX IF NOT EXISTS idx_tb_municipios_estado ON tb_municipios (id_estado);
-- FIM VIEW

-- Info
CREATE OR REPLACE VIEW v_estatisticas_estado_final AS
WITH 
-- Primeiro calculamos o total de focos por município
focos_por_municipio AS (
    SELECT
        m.id_estado,
        m.municipio,
        COUNT(fc.id_foco) AS total_focos
    FROM
        tb_municipios m
    LEFT JOIN
        tb_focos_calor fc ON m.id_municipio = fc.id_municipio
    WHERE
        fc.data_hora >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY
        m.id_estado, m.municipio
),

-- Depois pegamos apenas o top 5 por estado
top_5_cidades AS (
    SELECT
        id_estado,
        jsonb_agg(
            jsonb_build_object(
                'municipio', municipio,
                'total_focos', total_focos
            )
        ) AS top_cidades
    FROM (
        SELECT
            id_estado,
            municipio,
            total_focos,
            ROW_NUMBER() OVER (PARTITION BY id_estado ORDER BY total_focos DESC) AS rank
        FROM
            focos_por_municipio
    ) ranked
    WHERE
        rank <= 5
    GROUP BY
        id_estado
),

-- Agora o maior FRP por estado
maior_frp_estado AS (
    SELECT
        m.id_estado,
        jsonb_build_object(
            'municipio', m.municipio,
            'frp', fc.frp,
            'data', fc.data_hora
        ) AS maior_frp
    FROM
        tb_focos_calor fc
    JOIN
        tb_municipios m ON fc.id_municipio = m.id_municipio
    WHERE
        (m.id_estado, fc.frp) IN (
            SELECT
                m2.id_estado,
                MAX(fc2.frp)
            FROM
                tb_focos_calor fc2
            JOIN
                tb_municipios m2 ON fc2.id_municipio = m2.id_municipio
            GROUP BY
                m2.id_estado
        )
)

-- Resultado final
SELECT
    e.id_estado,
    e.estado,
    COALESCE(t.top_cidades, '[]'::jsonb) AS top_cidades,
    COALESCE(m.maior_frp, '{"municipio": "Nenhum", "frp": 0, "data": null}'::jsonb) AS maior_frp,
    CURRENT_TIMESTAMP AS ultima_atualizacao
FROM
    tb_estados e
LEFT JOIN
    top_5_cidades t ON e.id_estado = t.id_estado
LEFT JOIN
    maior_frp_estado m ON e.id_estado = m.id_estado;

-- FIM VIEW INFO

-- Focos de Calor por bioma
CREATE OR REPLACE FUNCTION get_focos_geojson_bioma(
    p_bioma_id integer,
    p_horas_intervalo integer DEFAULT 168
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    resultado jsonb;
BEGIN
    SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
            jsonb_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(fc.localizacao)::jsonb,
                'properties', jsonb_build_object(
                    'id', fc.id_foco,
                    'data', TO_CHAR(fc.data_hora, 'DD/MM/YYYY HH24:MI'),
                    'municipio', m.municipio,
                    'frp', fc.frp,
                    'risco', fc.risco_fogo,
                    'satelite', fc.satelite,
                    'bioma', b.bioma
                )
            )
        )
    ) INTO resultado
    FROM 
        tb_focos_calor fc
    JOIN 
        tb_municipios m ON fc.id_municipio = m.id_municipio
    JOIN
        tb_biomas b ON fc.id_bioma = b.id_bioma
    WHERE 
        b.id_bioma = p_bioma_id
        AND fc.data_hora >= (CURRENT_TIMESTAMP - (p_horas_intervalo || ' hours')::interval);
    
    RETURN resultado;
END;
$$;