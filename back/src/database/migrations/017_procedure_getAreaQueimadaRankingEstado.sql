CREATE OR REPLACE FUNCTION get_ranking_estados_area_queimada(
    p_ano INTEGER DEFAULT NULL,
    p_limite INTEGER DEFAULT 10
) RETURNS TABLE(
    posicao INTEGER,
    estado VARCHAR,
    area_total_km2 NUMERIC,
    percentual_nacional NUMERIC
) 
LANGUAGE plpgsql
AS $$
DECLARE
    total_nacional NUMERIC;
BEGIN
    -- Calcular total nacional
    SELECT (SUM(ST_Area(aq.geometry::geography))/1000000)::NUMERIC 
    INTO total_nacional
    FROM tb_area_queimada aq
    WHERE (p_ano IS NULL OR EXTRACT(YEAR FROM TO_DATE(aq.data, 'YYYYMMDD')) = p_ano);
    
    RETURN QUERY
    WITH ranking AS (
        SELECT 
            e.estado,
            ROUND((SUM(ST_Area(aq.geometry::geography))/1000000)::NUMERIC, 2) AS area_total_km2,
            ROW_NUMBER() OVER (ORDER BY SUM(ST_Area(aq.geometry::geography)) DESC) AS posicao
        FROM 
            tb_area_queimada aq
        JOIN 
            tb_estados e ON aq.id_estado = e.id_estado
        WHERE 
            (p_ano IS NULL OR EXTRACT(YEAR FROM TO_DATE(aq.data, 'YYYYMMDD')) = p_ano)
        GROUP BY 
            e.estado
        LIMIT p_limite
    )
    SELECT 
        r.posicao::INTEGER,
        r.estado,
        r.area_total_km2,
        CASE 
            WHEN total_nacional > 0 
            THEN ROUND((r.area_total_km2 / total_nacional) * 100, 2)
            ELSE 0::NUMERIC
        END AS percentual_nacional
    FROM ranking r
    ORDER BY r.posicao;
END;
$$;