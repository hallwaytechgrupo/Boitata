CREATE OR REPLACE FUNCTION get_grafico_area_queimada_bioma(
    p_ano INTEGER DEFAULT NULL,
    p_mes INTEGER DEFAULT NULL
) RETURNS TABLE(
    ano INTEGER,
    mes INTEGER,
    bioma VARCHAR,
    area_queimada_km2 NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(YEAR FROM TO_DATE(aq.data, 'YYYYMMDD'))::INTEGER AS ano,
        EXTRACT(MONTH FROM TO_DATE(aq.data, 'YYYYMMDD'))::INTEGER AS mes,
        b.bioma,
        ROUND((SUM(ST_Area(aq.geometry::geography))/1000000)::NUMERIC, 2) AS area_queimada_km2
    FROM 
        tb_area_queimada aq
    JOIN 
        tb_biomas b ON aq.id_bioma = b.id_bioma
    WHERE 
        (p_ano IS NULL OR EXTRACT(YEAR FROM TO_DATE(aq.data, 'YYYYMMDD')) = p_ano)
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM TO_DATE(aq.data, 'YYYYMMDD')) = p_mes)
    GROUP BY 
        ano, mes, b.bioma
    ORDER BY 
        ano, mes, area_queimada_km2 DESC;
END;
$$;