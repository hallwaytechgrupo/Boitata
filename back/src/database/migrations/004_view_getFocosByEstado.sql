CREATE OR REPLACE FUNCTION public.get_focos_geojson(
    p_estado_id integer,
    p_data_inicio timestamp DEFAULT NULL,
    p_data_fim timestamp DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
AS $function$
DECLARE
    resultado jsonb;
    v_data_inicio timestamp;
    v_data_fim timestamp;
BEGIN
    v_data_fim := COALESCE(p_data_fim, now());
    v_data_inicio := COALESCE(p_data_inicio, v_data_fim - INTERVAL '14 days');

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
                    'estado', e.estado
                )
            )
        )
    ) INTO resultado
    FROM 
        tb_focos_calor fc
    JOIN 
        tb_municipios m ON fc.id_municipio = m.id_municipio
    JOIN
        tb_estados e ON m.id_estado = e.id_estado
    WHERE 
        m.id_estado = p_estado_id
        AND fc.data_hora >= v_data_inicio
        AND fc.data_hora <= v_data_fim;
    
    RETURN resultado;
END;
$function$;