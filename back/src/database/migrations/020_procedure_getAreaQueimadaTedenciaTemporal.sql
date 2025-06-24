CREATE OR REPLACE FUNCTION get_tendencia_area_queimada(
    p_periodo_meses INTEGER DEFAULT 12
) RETURNS TABLE(
    ano_mes VARCHAR,
    mes_ano_formatado VARCHAR,
    area_total_km2 NUMERIC,
    variacao_percentual NUMERIC,
    bioma_mais_afetado VARCHAR,
    area_bioma_km2 NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH dados_mensais AS (
        SELECT 
            TO_CHAR(TO_DATE(aq.data, 'YYYYMMDD'), 'YYYY-MM') AS ano_mes,
            TO_CHAR(TO_DATE(aq.data, 'YYYYMMDD'), 'MM/YYYY') AS mes_ano_formatado,
            ROUND((SUM(ST_Area(aq.geometry::geography))/1000000)::NUMERIC, 2) AS area_total_km2
        FROM 
            tb_area_queimada aq
        WHERE 
            TO_DATE(aq.data, 'YYYYMMDD') >= CURRENT_DATE - INTERVAL '1 month' * p_periodo_meses
        GROUP BY 
            ano_mes, mes_ano_formatado
    ),
    dados_com_variacao AS (
        SELECT 
            *,
            LAG(area_total_km2) OVER (ORDER BY ano_mes) AS area_mes_anterior
        FROM dados_mensais
    ),
    dados_com_percentual AS (
        SELECT 
            *,
            CASE 
                WHEN area_mes_anterior > 0
                THEN ROUND(((area_total_km2 - area_mes_anterior) / area_mes_anterior) * 100, 2)
                ELSE 0::NUMERIC
            END AS variacao_percentual
        FROM dados_com_variacao
    ),
    bioma_mais_afetado_mes AS (
        SELECT DISTINCT ON (TO_CHAR(TO_DATE(aq.data, 'YYYYMMDD'), 'YYYY-MM'))
            TO_CHAR(TO_DATE(aq.data, 'YYYYMMDD'), 'YYYY-MM') AS ano_mes,
            b.bioma,
            ROUND((SUM(ST_Area(aq.geometry::geography))/1000000)::NUMERIC, 2) AS area_bioma_km2
        FROM 
            tb_area_queimada aq
        JOIN 
            tb_biomas b ON aq.id_bioma = b.id_bioma
        WHERE 
            TO_DATE(aq.data, 'YYYYMMDD') >= CURRENT_DATE - INTERVAL '1 month' * p_periodo_meses
        GROUP BY 
            ano_mes, b.bioma
        ORDER BY 
            ano_mes, area_bioma_km2 DESC
    )
    SELECT 
        d.ano_mes,
        d.mes_ano_formatado,
        d.area_total_km2,
        COALESCE(d.variacao_percentual, 0::NUMERIC) AS variacao_percentual,
        COALESCE(b.bioma, 'N/A') AS bioma_mais_afetado,
        COALESCE(b.area_bioma_km2, 0::NUMERIC) AS area_bioma_km2
    FROM 
        dados_com_percentual d
    LEFT JOIN 
        bioma_mais_afetado_mes b ON d.ano_mes = b.ano_mes
    ORDER BY 
        d.ano_mes;
END;
$$;