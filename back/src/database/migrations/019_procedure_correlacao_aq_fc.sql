CREATE OR REPLACE FUNCTION get_correlacao_focos_area_queimada(
    p_ano INTEGER DEFAULT NULL,
    p_mes INTEGER DEFAULT NULL
) RETURNS TABLE(
    estado VARCHAR,
    total_focos INTEGER,
    area_queimada_km2 NUMERIC,
    densidade_focos_por_km2 NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH focos_por_estado AS (
        SELECT 
            e.estado,
            COUNT(fc.id_foco) AS total_focos
        FROM 
            tb_estados e
        LEFT JOIN 
            tb_municipios m ON e.id_estado = m.id_estado
        LEFT JOIN 
            tb_focos_calor fc ON m.id_municipio = fc.id_municipio
        WHERE 
            (p_ano IS NULL OR EXTRACT(YEAR FROM fc.data_hora) = p_ano)
            AND (p_mes IS NULL OR EXTRACT(MONTH FROM fc.data_hora) = p_mes)
        GROUP BY 
            e.estado
    ),
    area_por_estado AS (
        SELECT 
            e.estado,
            ROUND((SUM(ST_Area(aq.geometry::geography))/1000000)::NUMERIC, 2) AS area_queimada_km2
        FROM 
            tb_estados e
        LEFT JOIN 
            tb_area_queimada aq ON e.id_estado = aq.id_estado
        WHERE 
            (p_ano IS NULL OR EXTRACT(YEAR FROM TO_DATE(aq.data, 'YYYYMMDD')) = p_ano)
            AND (p_mes IS NULL OR EXTRACT(MONTH FROM TO_DATE(aq.data, 'YYYYMMDD')) = p_mes)
        GROUP BY 
            e.estado
    )
    SELECT 
        f.estado,
        f.total_focos::INTEGER,
        COALESCE(a.area_queimada_km2, 0::NUMERIC) AS area_queimada_km2,
        CASE 
            WHEN COALESCE(a.area_queimada_km2, 0) > 0 
            THEN ROUND((f.total_focos::NUMERIC / a.area_queimada_km2), 2)
            ELSE 0::NUMERIC
        END AS densidade_focos_por_km2
    FROM 
        focos_por_estado f
    LEFT JOIN 
        area_por_estado a ON f.estado = a.estado
    WHERE 
        f.total_focos > 0 OR COALESCE(a.area_queimada_km2, 0) > 0
    ORDER BY 
        COALESCE(a.area_queimada_km2, 0) DESC;
END;
$$;