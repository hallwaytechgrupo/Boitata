CREATE OR REPLACE FUNCTION public.get_area_queimada_by_estado (
    p_estado_id INTEGER,
    p_data_inicio TIMESTAMP DEFAULT NULL,
    p_data_fim TIMESTAMP DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    resultado JSONB;
    v_data_inicio TIMESTAMP;
    v_data_fim TIMESTAMP;
BEGIN
    -- Definir datas padrão: últimos 14 dias se não especificado
    v_data_fim := COALESCE(p_data_fim, NOW());
    v_data_inicio := COALESCE(p_data_inicio, v_data_fim - INTERVAL '14 days');

    SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(jsonb_agg(
            jsonb_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(aq.geometry)::jsonb,
                'properties', jsonb_build_object(
                    'gid', aq.gid,
                    'dn', aq.dn,
                    'data', aq.data, -- Usar diretamente (formato YYYYMMDD, ex.: "20250401")
                    'bioma', b.bioma,
                    'estado', e.estado,
                    'municipio', m.municipio
                )
            )
        ), '[]'::jsonb)
    ) INTO resultado
    FROM 
        tb_area_queimada aq
    JOIN 
        tb_biomas b ON aq.id_bioma = b.id_bioma
    JOIN
        tb_estados e ON aq.id_estado = e.id_estado
    JOIN
        tb_municipios m ON aq.id_municipio = m.id_municipio
    WHERE 
        aq.id_estado = p_estado_id
        AND TO_DATE(aq.data, 'YYYYMMDD') >= v_data_inicio
        AND TO_DATE(aq.data, 'YYYYMMDD') <= v_data_fim;
    
    RETURN resultado;
END;
$$;