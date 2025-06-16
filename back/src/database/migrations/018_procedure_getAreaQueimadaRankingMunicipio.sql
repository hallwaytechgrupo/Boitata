CREATE OR REPLACE FUNCTION get_area_queimada_por_municipio(
    p_ano INTEGER DEFAULT NULL,
    p_mes INTEGER DEFAULT NULL,
    p_estado VARCHAR DEFAULT NULL,
    p_limite INTEGER DEFAULT 20
) RETURNS TABLE(
    municipio VARCHAR,
    estado VARCHAR,
    area_queimada_km2 NUMERIC,
    percentual_do_estado NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH dados_municipio AS (
        SELECT 
            m.municipio,
            e.estado,
            ROUND((SUM(ST_Area(aq.geometry::geography))/1000000)::NUMERIC, 2) AS area_km2
        FROM 
            tb_area_queimada aq
        JOIN 
            tb_municipios m ON aq.id_municipio = m.id_municipio
        JOIN 
            tb_estados e ON m.id_estado = e.id_estado
        WHERE 
            (p_ano IS NULL OR EXTRACT(YEAR FROM TO_DATE(aq.data, 'YYYYMMDD')) = p_ano)
            AND (p_mes IS NULL OR EXTRACT(MONTH FROM TO_DATE(aq.data, 'YYYYMMDD')) = p_mes)
            AND (p_estado IS NULL OR e.estado ILIKE p_estado)
        GROUP BY 
            m.municipio, e.estado
    ),
    total_por_estado AS (
        SELECT 
            estado,
            SUM(area_km2) AS total_estado_km2
        FROM dados_municipio
        GROUP BY estado
    )
    SELECT 
        dm.municipio,
        dm.estado,
        dm.area_km2 AS area_queimada_km2,
        CASE 
            WHEN te.total_estado_km2 > 0 
            THEN ROUND((dm.area_km2 / te.total_estado_km2) * 100, 2)
            ELSE 0::NUMERIC
        END AS percentual_do_estado
    FROM 
        dados_municipio dm
    JOIN 
        total_por_estado te ON dm.estado = te.estado
    WHERE 
        dm.area_km2 > 0
    ORDER BY 
        dm.area_km2 DESC
    LIMIT p_limite;
END;
$$;