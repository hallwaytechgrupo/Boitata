CREATE OR REPLACE FUNCTION public.get_all_biomas_geojson()
 RETURNS jsonb
 LANGUAGE sql
AS $function$
SELECT jsonb_build_object(
  'type', 'FeatureCollection',
  'features', jsonb_agg(
    jsonb_build_object(
      'type', 'Feature',
      'geometry', ST_AsGeoJSON(geometry)::jsonb,
      'properties', jsonb_build_object(
        'id', id_bioma,
        'nome', bioma
      )
    )
  )
)
FROM tb_biomas;
$function$
