CREATE OR REPLACE FUNCTION public.get_focos_by_area(
    p_pontos geometry
)
RETURNS TABLE(
    id_foco UUID,
    municipio VARCHAR(255),
    estado VARCHAR(255),
    bioma VARCHAR(255)
)
LANGUAGE plpgsql
AS $function$
DECLARE
    v_poligono geometry;
BEGIN
    -- Converter MultiPoint para um polígono usando o casco convexo
    v_poligono := ST_ConvexHull(p_pontos);
    
    RETURN QUERY
    SELECT 
        fc.id_foco,
        m.municipio,
        e.estado,
        b.bioma
    FROM 
        tb_focos_calor fc
    JOIN 
        tb_municipios m ON fc.id_municipio = m.id_municipio
    JOIN
        tb_estados e ON m.id_estado = e.id_estado
    JOIN
        tb_biomas b ON fc.id_bioma = b.id_bioma
    WHERE 
        ST_Within(fc.localizacao, v_poligono);
END;
$function$;

-- Exemplo de busca de focos em uma área triangular
-- SELECT * FROM public.get_focos_by_area(
--   ST_GeomFromText('MULTIPOINT((-47.5 -15.2), (-47.3 -15.2), (-47.4 -15.0))', 4326)
-- );

-- -- Exemplo alternativo usando uma área quadrilátera
-- SELECT * FROM public.get_focos_by_area(
--   ST_GeomFromText('MULTIPOINT((-48.0 -16.0), (-47.0 -16.0), (-47.0 -15.0), (-48.0 -15.0))', 4326)
-- );