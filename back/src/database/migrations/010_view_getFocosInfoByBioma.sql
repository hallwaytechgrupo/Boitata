CREATE OR REPLACE VIEW v_estatisticas_bioma AS
WITH 
-- Contagem de focos por município em cada bioma
focos_por_municipio_bioma AS (
    SELECT
        fc.id_bioma,
        fc.id_municipio,
        COUNT(fc.id_foco) as total_focos
    FROM
        tb_focos_calor fc
    WHERE
        fc.data_hora >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY
        fc.id_bioma, fc.id_municipio
),

-- Ranking dos municípios com mais focos por bioma
ranking_municipios AS (
    SELECT
        fpm.id_bioma,
        fpm.id_municipio,
        fpm.total_focos,
        ROW_NUMBER() OVER (PARTITION BY fpm.id_bioma ORDER BY fpm.total_focos DESC) AS rank
    FROM
        focos_por_municipio_bioma fpm
),

-- Enriquecimento com nomes de municípios e estados
municipios_enriquecidos AS (
    SELECT
        r.id_bioma,
        r.id_municipio,
        m.municipio,
        e.estado,
        r.total_focos
    FROM
        ranking_municipios r
    JOIN
        tb_municipios m ON r.id_municipio = m.id_municipio
    JOIN
        tb_estados e ON m.id_estado = e.id_estado
    WHERE
        r.rank <= 5
),

-- Agrupamento em formato JSON
top_municipios_agrupados AS (
    SELECT
        id_bioma,
        jsonb_agg(
            jsonb_build_object(
                'municipio', municipio,
                'estado', estado,
                'total_focos', total_focos
            )
            ORDER BY total_focos DESC
        ) AS top_municipios
    FROM
        municipios_enriquecidos
    GROUP BY
        id_bioma
),

-- Tendência mensal por bioma (mês a mês)
tendencia_mensal AS (
    SELECT
        fc.id_bioma,
        TO_CHAR(date_trunc('month', fc.data_hora), 'YYYY-MM') AS mes,
        COUNT(fc.id_foco) AS total_focos
    FROM
        tb_focos_calor fc
    WHERE
        fc.data_hora >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY
        fc.id_bioma, mes
),

-- Agrupamento da tendência em formato JSON
tendencia_agrupada AS (
    SELECT
        id_bioma,
        jsonb_agg(
            jsonb_build_object(
                'mes', mes,
                'total', total_focos
            )
            ORDER BY mes
        ) AS tendencia
    FROM
        tendencia_mensal
    GROUP BY
        id_bioma
),

-- Média de FRP e risco de fogo por bioma
metricas_fogo AS (
    SELECT
        fc.id_bioma,
        AVG(fc.frp) AS frp_medio,
        MAX(fc.frp) AS frp_maximo,
        AVG(fc.risco_fogo) AS risco_medio,
        MAX(fc.risco_fogo) AS risco_maximo
    FROM
        tb_focos_calor fc
    WHERE
        fc.data_hora >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY
        fc.id_bioma
),

-- Contagem total de focos por bioma nos últimos 30 dias
total_focos_recentes AS (
    SELECT
        id_bioma,
        COUNT(id_foco) AS total_focos_30dias
    FROM
        tb_focos_calor
    WHERE
        data_hora >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY
        id_bioma
),

-- Contagem total de focos por bioma (histórico completo)
total_focos_historicos AS (
    SELECT
        id_bioma,
        COUNT(id_foco) AS total_focos_historico
    FROM
        tb_focos_calor
    GROUP BY
        id_bioma
)

-- Resultado final agregando todas as estatísticas
SELECT
    b.id_bioma,
    b.bioma,
    COALESCE(tfr.total_focos_30dias, 0) AS total_focos_30dias,
    COALESCE(tfh.total_focos_historico, 0) AS total_focos_historico,
    COALESCE(tm.top_municipios, '[]'::jsonb) AS top_municipios_afetados,
    COALESCE(ta.tendencia, '[]'::jsonb) AS tendencia_mensal,
    COALESCE(mf.frp_medio, 0) AS frp_medio,
    COALESCE(mf.frp_maximo, 0) AS frp_maximo,
    COALESCE(mf.risco_medio, 0) AS risco_medio,
    COALESCE(mf.risco_maximo, 0) AS risco_maximo,
    ST_Area(b.geometry::geography)/1000000 AS area_km2,
    CASE 
        WHEN ST_Area(b.geometry::geography) > 0 
        THEN COALESCE(tfr.total_focos_30dias, 0)/(ST_Area(b.geometry::geography)/1000000)
        ELSE 0
    END AS densidade_focos_por_km2,
    CURRENT_TIMESTAMP AS ultima_atualizacao
FROM
    tb_biomas b
LEFT JOIN
    total_focos_recentes tfr ON b.id_bioma = tfr.id_bioma
LEFT JOIN
    total_focos_historicos tfh ON b.id_bioma = tfh.id_bioma
LEFT JOIN
    top_municipios_agrupados tm ON b.id_bioma = tm.id_bioma
LEFT JOIN
    tendencia_agrupada ta ON b.id_bioma = ta.id_bioma
LEFT JOIN
    metricas_fogo mf ON b.id_bioma = mf.id_bioma;