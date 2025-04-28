CREATE OR REPLACE FUNCTION processar_focos_calor()
RETURNS VOID AS $$
BEGIN
    INSERT INTO tb_focos_calor (
        id_foco, localizacao, data_hora, satelite, 
        id_municipio, id_bioma, frp, risco_fogo
    )
    SELECT 
        id::UUID,
        ST_SetSRID(ST_MakePoint(lon, lat), 4326),
        data_hora_gmt,
        satelite,
        municipio_id,
        (SELECT id_bioma FROM tb_biomas WHERE bioma = temp_focos_calor.bioma),
        frp,
        risco_fogo
    FROM temp_focos_calor
    ON CONFLICT (id_foco) DO NOTHING;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE IF NOT EXISTS tb_arquivos_processados (
    id SERIAL PRIMARY KEY,
    file_hash TEXT UNIQUE NOT NULL,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

