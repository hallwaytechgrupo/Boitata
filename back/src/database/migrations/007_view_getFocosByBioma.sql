CREATE OR REPLACE FUNCTION public.get_focos_geojson_bioma(p_bioma_id integer, p_horas_intervalo integer DEFAULT 168)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    resultado jsonb;
BEGIN
    SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
            jsonb_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(fc.localizacao)::jsonb,
                'properties', jsonb_build_object(
                    'id', fc.id_foco,
                    'data', TO_CHAR(fc.data_hora, 'DD/MM/YYYY HH24:MI'),
                    'municipio', m.municipio,
                    'frp', fc.frp,
                    'risco', fc.risco_fogo,
                    'satelite', fc.satelite,
                    'bioma', b.bioma
                )
            )
        )
    ) INTO resultado
    FROM 
        tb_focos_calor fc
    JOIN 
        tb_municipios m ON fc.id_municipio = m.id_municipio
    JOIN
        tb_biomas b ON fc.id_bioma = b.id_bioma
    WHERE 
        b.id_bioma = p_bioma_id
        AND fc.data_hora >= (CURRENT_TIMESTAMP - (p_horas_intervalo || ' hours')::interval);
    
    RETURN resultado;
END;
$function$
