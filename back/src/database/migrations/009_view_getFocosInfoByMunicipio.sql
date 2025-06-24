CREATE OR REPLACE VIEW v_estatisticas_municipio AS
WITH 
-- Série histórica de focos nos últimos 6 meses
serie_historica AS (
    SELECT 
        m.id_municipio,
        TO_CHAR(date_trunc('month', fc.data_hora), 'YYYY-MM') AS mes,
        COUNT(fc.id_foco) AS total_focos
    FROM 
        tb_municipios m
    LEFT JOIN 
        tb_focos_calor fc ON m.id_municipio = fc.id_municipio
    WHERE 
        fc.data_hora >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY 
        m.id_municipio, mes
),

-- Satélites que mais detectaram focos no município
deteccao_por_satelite AS (
    SELECT
        m.id_municipio,
        fc.satelite,
        COUNT(fc.id_foco) AS total_focos
    FROM
        tb_municipios m
    JOIN
        tb_focos_calor fc ON m.id_municipio = fc.id_municipio
    WHERE
        fc.data_hora >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY
        m.id_municipio, fc.satelite
),

-- Agrupamento dos satélites em json
satelites_agrupados AS (
    SELECT
        id_municipio,
        jsonb_agg(
            jsonb_build_object(
                'satelite', satelite,
                'total_focos', total_focos
            )
        ) AS satelites
    FROM
        deteccao_por_satelite
    GROUP BY
        id_municipio
),

-- Áreas com maior risco de fogo
areas_risco AS (
    SELECT
        m.id_municipio,
        AVG(fc.risco_fogo) AS risco_medio,
        MAX(fc.risco_fogo) AS risco_maximo
    FROM
        tb_municipios m
    JOIN
        tb_focos_calor fc ON m.id_municipio = fc.id_municipio
    WHERE
        fc.data_hora >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY
        m.id_municipio
),

-- Histórico de poder radiativo (FRP)
historico_frp AS (
    SELECT
        m.id_municipio,
        MAX(fc.frp) AS frp_maximo,
        AVG(fc.frp) AS frp_medio
    FROM
        tb_municipios m
    JOIN
        tb_focos_calor fc ON m.id_municipio = fc.id_municipio
    WHERE
        fc.data_hora >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY
        m.id_municipio
),

-- Total de focos nos últimos 30 dias
total_focos_municipio AS (
    SELECT 
        m.id_municipio,
        COUNT(fc.id_foco) AS total_focos_30dias
    FROM
        tb_municipios m
    LEFT JOIN
        tb_focos_calor fc ON m.id_municipio = fc.id_municipio AND fc.data_hora >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY
        m.id_municipio
),

-- Série histórica agrupada em json
serie_historica_agrupada AS (
    SELECT
        id_municipio,
        jsonb_agg(
            jsonb_build_object(
                'mes', mes,
                'total', total_focos
            )
        ) AS dados_serie
    FROM
        serie_historica
    GROUP BY
        id_municipio
)

-- Resultado final agregando todas as estatísticas
SELECT
    m.id_municipio,
    m.municipio,
    e.estado,
    COALESCE(tf.total_focos_30dias, 0) AS total_focos_30dias,
    COALESCE(sh.dados_serie, '[]'::jsonb) AS serie_historica,
    COALESCE(s.satelites, '[]'::jsonb) AS deteccao_satelites,
    COALESCE(r.risco_medio, 0) AS risco_fogo_medio,
    COALESCE(r.risco_maximo, 0) AS risco_fogo_maximo,
    COALESCE(h.frp_maximo, 0) AS frp_maximo,
    COALESCE(h.frp_medio, 0) AS frp_medio,
    CURRENT_TIMESTAMP AS ultima_atualizacao
FROM
    tb_municipios m
LEFT JOIN
    tb_estados e ON m.id_estado = e.id_estado
LEFT JOIN
    total_focos_municipio tf ON m.id_municipio = tf.id_municipio
LEFT JOIN
    serie_historica_agrupada sh ON m.id_municipio = sh.id_municipio
LEFT JOIN
    satelites_agrupados s ON m.id_municipio = s.id_municipio
LEFT JOIN
    areas_risco r ON m.id_municipio = r.id_municipio
LEFT JOIN
    historico_frp h ON m.id_municipio = h.id_municipio;