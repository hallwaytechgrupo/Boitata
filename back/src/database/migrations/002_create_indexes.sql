
CREATE INDEX IF NOT EXISTS idx_tb_estados_geometry ON tb_estados USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_tb_municipios_geometry ON tb_municipios USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_tb_area_queimada_geometry ON tb_area_queimada USING GIST (geometry);
CREATE INDEX IF NOT EXISTS idx_tb_focos_calor_localizacao ON tb_focos_calor USING GIST (localizacao);
CREATE INDEX IF NOT EXISTS idx_tb_biomas_geometry ON tb_biomas USING GIST (geometry);