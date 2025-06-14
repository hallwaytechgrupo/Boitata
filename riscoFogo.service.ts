import { query } from "../config/database";

export class RiscoFogoService {
  // Consulta risco de fogo em formato GeoJSON para o mapa por estado
  async getGeoJsonByEstado(estadoId: number) {
    const result = await query(
      `SELECT 
        jsonb_build_object(
          'type', 'FeatureCollection',
          'features', jsonb_agg(
            jsonb_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(ST_Simplify(r.geometry, 0.01))::jsonb,
              'properties', jsonb_build_object(
                'id_estado', e.id_estado,
                'estado', e.estado,
                'dn', r.dn
              )
            )
          )
        ) as geojson
      FROM 
        tb_risco_fogo r
      JOIN 
        tb_estados e
      ON 
        ST_Intersects(r.geometry, e.geometry)
      WHERE 
        r.dn = 1
        AND e.id_estado = $1
      LIMIT 100;`, // Limita a quantidade de registros
      [estadoId]
    );

    return (
      result.rows[0]?.geojson || { type: "FeatureCollection", features: [] }
    );
  }

  // Consulta risco de fogo em formato GeoJSON para o mapa por estado com paginação
  async getGeoJsonByEstadoPaginated(
    estadoId: number,
    limit: number,
    offset: number
  ) {
    const result = await query(
      `SELECT 
        jsonb_build_object(
          'type', 'FeatureCollection',
          'features', jsonb_agg(
            jsonb_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(r.geometry)::jsonb,
              'properties', jsonb_build_object(
                'id_estado', e.id_estado,
                'estado', e.estado,
                'dn', r.dn
              )
            )
          )
        ) as geojson
      FROM 
        tb_risco_fogo r
      JOIN 
        tb_estados e
      ON 
        ST_Intersects(r.geometry, e.geometry)
      WHERE 
        r.dn = 1
        AND e.id_estado = $1
      LIMIT $2 OFFSET $3;`, // Limita os registros e aplica o deslocamento
      [estadoId, limit, offset]
    );

    return (
      result.rows[0]?.geojson || { type: "FeatureCollection", features: [] }
    );
  }

  // Consulta risco de fogo em formato GeoJSON para o mapa por biomas
  async getGeoJsonPorBiomas(biomaId: number) {
    const result = await query(
      `SELECT 
      jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
          jsonb_build_object(
            'type', 'Feature',
            'geometry', ST_AsGeoJSON(sub.geometry)::jsonb,
            'properties', jsonb_build_object(
              'id_bioma', sub.id_bioma,
              'bioma', sub.bioma,
              'dn', sub.dn
            )
          )
        )
      ) as geojson
    FROM (
      SELECT 
        r.geometry,
        b.id_bioma,
        b.bioma,
        r.dn
      FROM 
        tb_risco_fogo r
      JOIN 
        tb_biomas b
      ON 
        ST_Intersects(r.geometry, b.geometry)
      WHERE 
        r.dn = 1
        AND b.id_bioma = $1
      ORDER BY r.id ASC
      LIMIT 100
    ) sub;`, // Subconsulta para ordenar antes de agregar
      [biomaId]
    );

    return (
      result.rows[0]?.geojson || { type: "FeatureCollection", features: [] }
    );
  }

  // Consulta materializada para risco de fogo por biomas
  async getMaterializedViewBiomas() {
    const result = await query(`SELECT * FROM mv_geojson_biomas LIMIT 100;`);

    return (
      result.rows[0]?.geojson || { type: "FeatureCollection", features: [] }
    );
  }
}
