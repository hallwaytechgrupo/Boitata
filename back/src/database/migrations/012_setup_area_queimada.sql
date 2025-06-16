DO $$
BEGIN
  -- Rename id_area_queimada to gid if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns 
         WHERE table_name = 'tb_area_queimada' AND column_name = 'id_area_queimada') THEN
    ALTER TABLE tb_area_queimada RENAME COLUMN id_area_queimada TO gid;
  END IF;

  -- Rename date to dn if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns 
         WHERE table_name = 'tb_area_queimada' AND column_name = 'date') THEN
    ALTER TABLE tb_area_queimada RENAME COLUMN date TO dn;
  END IF;

  -- Add id_municipio column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tb_area_queimada' AND column_name = 'id_municipio') THEN
    ALTER TABLE tb_area_queimada ADD COLUMN id_municipio INT REFERENCES tb_municipios(id_municipio);
  END IF;

  -- Add id_estado column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tb_area_queimada' AND column_name = 'id_estado') THEN
    ALTER TABLE tb_area_queimada ADD COLUMN id_estado INT REFERENCES tb_estados(id_estado);
  END IF;

  -- Add id_bioma column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tb_area_queimada' AND column_name = 'id_bioma') THEN
    ALTER TABLE tb_area_queimada ADD COLUMN id_bioma INT REFERENCES tb_biomas(id_bioma);
  END IF;

  -- Add data column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'tb_area_queimada' AND column_name = 'data') THEN
    ALTER TABLE tb_area_queimada ADD COLUMN data character varying(20);
  END IF;

END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_tb_area_queimada_geometry'
  ) THEN
    CREATE INDEX idx_tb_area_queimada_geometry ON tb_area_queimada USING GIST (geometry);
  END IF;
END$$;

CREATE OR REPLACE PROCEDURE procedure_normalize_area_queimada()
LANGUAGE plpgsql
AS $$
DECLARE
  batch_size INT := 1000; -- Tamanho do lote (ajuste conforme necessário)
  min_gid INT;
  max_gid INT;
  current_gid INT;
  total_records INT;
  inserted_records INT := 0;
BEGIN
  -- Obter o menor e o maior gid da tabela area_queimada_inpe
  SELECT MIN(gid), MAX(gid) 
  INTO min_gid, max_gid
  FROM area_queimada_inpe;
  
  -- Contar o total de registros
  SELECT COUNT(*) 
  INTO total_records
  FROM area_queimada_inpe;
  
  RAISE NOTICE 'Total de registros a processar: %', total_records;
  
  -- Iniciar o loop por lotes
  current_gid := min_gid;
  WHILE current_gid <= max_gid LOOP
    -- Inserir o lote atual
    INSERT INTO tb_area_queimada (gid, dn, data, geometry, id_bioma, id_estado, id_municipio)
    SELECT 
      aq.gid,
      aq.dn,
      aq.data,
      aq.geom AS geometry,
      (SELECT b.id_bioma
       FROM tb_biomas b
       WHERE ST_Intersects(aq.geom, b.geometry)
       ORDER BY ST_Area(ST_Intersection(aq.geom, b.geometry)) DESC
       LIMIT 1) AS id_bioma,
      (SELECT e.id_estado
       FROM tb_estados e
       WHERE ST_Intersects(aq.geom, e.geometry)
       ORDER BY ST_Area(ST_Intersection(aq.geom, e.geometry)) DESC
       LIMIT 1) AS id_estado,
      (SELECT m.id_municipio
       FROM tb_municipios m
       WHERE ST_Intersects(aq.geom, m.geometry)
       ORDER BY ST_Area(ST_Intersection(aq.geom, m.geometry)) DESC
       LIMIT 1) AS id_municipio
    FROM area_queimada_inpe aq
    WHERE aq.gid BETWEEN current_gid AND (current_gid + batch_size - 1)
    ON CONFLICT (gid) DO NOTHING;

    -- Contar registros inseridos no lote
    GET DIAGNOSTICS inserted_records = ROW_COUNT;
    
    -- Exibir progresso
    RAISE NOTICE 'Processando gids de % a %, Inseridos no lote: %', 
      current_gid, (current_gid + batch_size - 1), inserted_records;
    
    -- Avançar para o próximo lote
    current_gid := current_gid + batch_size;
    
    -- Commit para liberar memória
    COMMIT;
  END LOOP;
  
  -- Verificar total de registros inseridos
  SELECT COUNT(*) 
  INTO inserted_records
  FROM tb_area_queimada;
  
  RAISE NOTICE 'Processamento concluído! Total de registros inseridos: %', inserted_records;
END $$;