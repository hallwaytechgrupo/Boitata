-- Remover view antiga, se existir
DROP VIEW IF EXISTS public.v_focos_calor_estatisticas_bioma;

-- Remover view materializada antiga, se existir
DROP MATERIALIZED VIEW IF EXISTS public.v_focos_calor_estatisticas_bioma;

-- Criar a view materializada v_focos_calor_estatisticas_bioma
CREATE MATERIALIZED VIEW public.v_focos_calor_estatisticas_bioma AS
WITH 
-- Contagem de focos, média de FRP e dias com focos por bioma nos últimos 30 dias
contagem_focos_bioma AS (
    SELECT
        b.id_bioma,
        COUNT(fc.id_foco) AS total_focos_30dias,
        AVG(fc.frp) FILTER (WHERE fc.frp != -999) AS frp_medio,
        COUNT(DISTINCT date_trunc('day', fc.data_hora)::DATE) AS dias_com_focos
    FROM tb_biomas b
    LEFT JOIN tb_focos_calor fc ON b.id_bioma = fc.id_bioma
        AND fc.data_hora >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY b.id_bioma
),

-- Série histórica diária nos últimos 30 dias
serie_historica AS (
    SELECT 
        b.id_bioma,
        TO_CHAR(fc.data_hora, 'YYYY-MM-DD') AS dia,
        COUNT(fc.id_foco) AS total_focos,
        AVG(fc.frp) FILTER (WHERE fc.frp != -999) AS frp_medio
    FROM tb_biomas b
    LEFT JOIN tb_focos_calor fc ON b.id_bioma = fc.id_bioma
        AND fc.data_hora >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY b.id_bioma, dia
),

-- Focos por faixa de intensidade (FRP: 0-50, 50-100, >100 MW)
focos_por_intensidade AS (
    SELECT
        b.id_bioma,
        CASE
            WHEN fc.frp < 50 THEN '0-50 MW'
            WHEN fc.frp < 100 THEN '50-100 MW'
            ELSE '>100 MW'
        END AS faixa,
        COUNT(fc.id_foco) AS total_focos
    FROM tb_biomas b
    JOIN tb_focos_calor fc ON b.id_bioma = fc.id_bioma
        AND fc.data_hora >= CURRENT_DATE - INTERVAL '30 days'
        AND fc.frp != -999
    GROUP BY b.id_bioma, faixa
),

-- Agrupamento da série histórica em JSONB
serie_historica_agrupada AS (
    SELECT
        id_bioma,
        jsonb_agg(
            jsonb_build_object(
                'dia', dia,
                'total', total_focos,
                'frp_medio', ROUND(frp_medio::NUMERIC, 2)
            ) ORDER BY dia
        ) AS dados_serie
    FROM serie_historica
    GROUP BY id_bioma
),

-- Agrupamento das intensidades em JSONB
intensidades_agrupadas AS (
    SELECT
        id_bioma,
        jsonb_agg(
            jsonb_build_object(
                'faixa', faixa,
                'total', total_focos
            ) ORDER BY faixa
        ) AS focos_por_intensidade
    FROM focos_por_intensidade
    GROUP BY id_bioma
)

-- Resultado final
SELECT
    b.id_bioma,
    b.bioma,
    COALESCE(cf.total_focos_30dias, 0) AS total_focos_30dias,
    COALESCE(ROUND(cf.frp_medio::NUMERIC, 2), 0) AS frp_medio,
    COALESCE(cf.dias_com_focos, 0) AS dias_com_focos,
    COALESCE(sh.dados_serie, '[]'::jsonb) AS serie_historica,
    COALESCE(i.focos_por_intensidade, '[]'::jsonb) AS focos_por_intensidade,
    CURRENT_TIMESTAMP AS ultima_atualizacao
FROM tb_biomas b
LEFT JOIN contagem_focos_bioma cf ON b.id_bioma = cf.id_bioma
LEFT JOIN serie_historica_agrupada sh ON b.id_bioma = sh.id_bioma
LEFT JOIN intensidades_agrupadas i ON b.id_bioma = i.id_bioma
WITH DATA;

-- Comentário
COMMENT ON MATERIALIZED VIEW public.v_focos_calor_estatisticas_bioma IS 'View materializada simplificada com estatísticas de focos de calor nos últimos 30 dias por bioma, incluindo total de focos, média de FRP, dias com focos, série histórica diária e focos por intensidade, para KPIs e gráficos (pizza, dispersão, barras, linha)';

-- Criar índices para otimizar consultas
CREATE UNIQUE INDEX idfocos_calor_x_v_estatisticas_bioma_id_bioma ON public.v_focos_calor_estatisticas_bioma (id_bioma);
CREATE INDEX idfocos_calor_x_v_estatisticas_bioma_total_focos ON public.v_focos_calor_estatisticas_bioma (total_focos_30dias);
CREATE INDEX idfocos_calor_x_v_estatisticas_bioma_serie_historica ON public.v_focos_calor_estatisticas_bioma USING GIN (serie_historica);
CREATE INDEX idfocos_calor_x_v_estatisticas_bioma_focos_intensidade ON public.v_focos_calor_estatisticas_bioma USING GIN (focos_por_intensidade);

-- -- Consulta para KPIs
-- SELECT
--     bioma,
--     total_focos_30dias,
--     frp_medio,
--     dias_com_focos
-- FROM v_focos_calor_estatisticas_bioma
-- ORDER BY total_focos_30dias DESC;

-- -- Consulta para Gráfico de Pizza: Distribuição de Focos por Bioma
-- SELECT
--     bioma,
--     total_focos_30dias
-- FROM v_focos_calor_estatisticas_bioma
-- WHERE total_focos_30dias > 0
-- ORDER BY total_focos_30dias DESC;

-- -- Consulta para Gráfico de Dispersão: FRP Médio vs. Total de Focos por Dia
-- SELECT
--     v.id_bioma,
--     v.bioma,
--     elem->>'dia' AS dia,
--     (elem->>'total')::INTEGER AS total_focos,
--     (elem->>'frp_medio')::NUMERIC AS frp_medio
-- FROM v_focos_calor_estatisticas_bioma v
-- CROSS JOIN LATERAL jsonb_array_elements(v.serie_historica) AS elem
-- WHERE (elem->>'total')::INTEGER > 0
-- ORDER BY v.id_bioma, dia;

-- -- Consulta para Gráfico de Barras: Top 5 Dias com Mais Focos por Bioma
-- SELECT
--     v.id_bioma,
--     v.bioma,
--     elem->>'dia' AS dia,
--     (elem->>'total')::INTEGER AS total_focos,
--     (elem->>'frp_medio')::NUMERIC AS frp_medio
-- FROM v_focos_calor_estatisticas_bioma v
-- CROSS JOIN LATERAL jsonb_array_elements(v.serie_historica) AS elem
-- WHERE (elem->>'total')::INTEGER > 0
-- ORDER BY v.id_bioma, (elem->>'total')::INTEGER DESC
-- LIMIT 5;

-- -- Consulta para Gráfico de Linha: Crescimento de Focos Diários para os 5 Biomas com Mais Focos
-- SELECT
--     v.id_bioma,
--     v.bioma,
--     elem->>'dia' AS dia,
--     (elem->>'total')::INTEGER AS total_focos
-- FROM v_focos_calor_estatisticas_bioma v
-- CROSS JOIN LATERAL jsonb_array_elements(v.serie_historica) AS elem
-- WHERE v.id_bioma IN (
--     SELECT id_bioma
--     FROM v_focos_calor_estatisticas_bioma
--     ORDER BY total_focos_30dias DESC
--     LIMIT 5
-- )
-- ORDER BY v.id_bioma, dia;

-- -- Consulta para KPI: Média Diária de Focos para um Bioma Específico
-- SELECT
--     bioma,
--     total_focos_30dias,
--     dias_com_focos,
--     CASE
--         WHEN dias_com_focos > 0
--         THEN ROUND((total_focos_30dias::FLOAT / dias_com_focos)::NUMERIC, 2)
--         ELSE 0
--     END AS media_diaria_focos
-- FROM v_estatisticas_bioma
-- WHERE id_bioma = :id_bioma; -- Substitua :id_bioma pelo ID desejado (e.g., 1)

-- -- Consulta para Evolução Histórica: Série Diária de Focos e FRP Médio para um Bioma Específico
-- SELECT
--     bioma,
--     elem->>'dia' AS dia,
--     (elem->>'total')::INTEGER AS total_focos,
--     (elem->>'frp_medio')::NUMERIC AS frp_medio
-- FROM v_estatisticas_bioma
-- CROSS JOIN LATERAL jsonb_array_elements(serie_historica) AS elem
-- WHERE id_bioma = :id_bioma -- Substitua :id_bioma pelo ID desejado (e.g., 1)
-- ORDER BY dia;

-- -- Exemplo de atualização da view materializada
-- -- REFRESH MATERIALIZED VIEW public.v_focos_calor_estatisticas_bioma; -- Para atualização completa
-- -- REFRESH MATERIALIZED VIEW CONCURRENTLY public.v_focos_calor_estatisticas_bioma; -- Para atualização concorrente