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