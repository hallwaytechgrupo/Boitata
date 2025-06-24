
-- Tabela materializada para armazenar métricas pré-calculadas (ano 2025)
CREATE MATERIALIZED VIEW mat_focos_calor_estado AS
SELECT 
    e.id_estado,
    e.estado AS nome_estado,
    f.satelite,
    EXTRACT(YEAR FROM f.data_hora) AS ano,
    EXTRACT(MONTH FROM f.data_hora) AS mes,
    COUNT(f.id_foco) AS total_focos,
    AVG(f.risco_fogo) AS media_risco_fogo,
    AVG(f.frp) AS media_frp
FROM tb_estados e
JOIN tb_municipios m ON e.id_estado = m.id_estado
JOIN tb_focos_calor f ON m.id_municipio = f.id_municipio
WHERE EXTRACT(YEAR FROM f.data_hora) = 2025
GROUP BY e.id_estado, e.estado, f.satelite, EXTRACT(YEAR FROM f.data_hora), EXTRACT(MONTH FROM f.data_hora)
WITH DATA;

-- Índices para otimizar consultas na tabela materializada
CREATE INDEX idx_mat_focos_calor_estado_id_estado ON mat_focos_calor_estado (id_estado);
CREATE INDEX idx_mat_focos_calor_estado_satelite ON mat_focos_calor_estado (satelite);
CREATE INDEX idx_mat_focos_calor_estado_mes ON mat_focos_calor_estado (mes);

-- View principal ajustada para usar a tabela materializada
CREATE OR REPLACE VIEW vw_focos_calor_estado AS
SELECT 
    id_estado,
    nome_estado,
    satelite,
    ano,
    mes,
    total_focos,
    media_risco_fogo,
    media_frp
FROM mat_focos_calor_estado;

-- View para KPI: Total de focos por estado
CREATE OR REPLACE VIEW vw_kpi_total_focos_estado AS
SELECT 
    id_estado,
    nome_estado,
    SUM(total_focos) AS total_focos
FROM mat_focos_calor_estado
GROUP BY id_estado, nome_estado
ORDER BY total_focos DESC;

-- View para KPI: Mês com maior incidência de focos por estado
CREATE OR REPLACE VIEW vw_kpi_mes_maior_focos AS
SELECT DISTINCT ON (id_estado)
    id_estado,
    nome_estado,
    mes,
    total_focos
FROM mat_focos_calor_estado
WHERE total_focos = (
    SELECT MAX(total_focos)
    FROM mat_focos_calor_estado v2
    WHERE v2.id_estado = mat_focos_calor_estado.id_estado
)
ORDER BY id_estado, total_focos DESC;

-- View para KPI: Média de risco de fogo por estado
CREATE OR REPLACE VIEW vw_kpi_risco_medio_estado AS
SELECT 
    id_estado,
    nome_estado,
    ROUND(AVG(media_risco_fogo), 2) AS risco_medio
FROM mat_focos_calor_estado
GROUP BY id_estado, nome_estado
ORDER BY risco_medio DESC;

-- View para KPI: Percentual de focos por satélite
CREATE OR REPLACE VIEW vw_kpi_focos_por_satelite AS
SELECT 
    id_estado,
    nome_estado,
    satelite,
    SUM(total_focos) AS total_focos,
    ROUND(SUM(total_focos) * 100.0 / SUM(SUM(total_focos)) OVER (PARTITION BY id_estado), 2) AS percentual
FROM mat_focos_calor_estado
GROUP BY id_estado, nome_estado, satelite
ORDER BY id_estado, percentual DESC;

-- View para Gráfico: Evolução temporal dos focos por estado
CREATE OR REPLACE VIEW vw_grafico_evolucao_temporal AS
SELECT 
    id_estado,
    nome_estado,
    mes,
    SUM(total_focos) AS total_focos
FROM mat_focos_calor_estado
GROUP BY id_estado, nome_estado, mes
ORDER BY id_estado, mes;

-- View para Gráfico: Comparação de focos por satélite
CREATE OR REPLACE VIEW vw_grafico_comparacao_satelite AS
SELECT 
    id_estado,
    nome_estado,
    satelite,
    SUM(total_focos) AS total_focos
FROM mat_focos_calor_estado
GROUP BY id_estado, nome_estado, satelite
ORDER BY id_estado, total_focos DESC;

-- View para Gráfico: Distribuição de focos por estado
CREATE OR REPLACE VIEW vw_grafico_distribuicao_estado AS
SELECT 
    id_estado,
    nome_estado,
    SUM(total_focos) AS total_focos
FROM mat_focos_calor_estado
GROUP BY id_estado, nome_estado
ORDER BY total_focos DESC;

-- View para Gráfico: Correlação risco de fogo vs. focos
CREATE OR REPLACE VIEW vw_grafico_correlacao_risco_focos AS
SELECT 
    id_estado,
    nome_estado,
    ROUND(AVG(media_risco_fogo), 2) AS media_risco_fogo,
    SUM(total_focos) AS total_focos
FROM mat_focos_calor_estado
GROUP BY id_estado, nome_estado
ORDER BY id_estado, media_risco_fogo;

-- Procedure para consultas dinâmicas (mantém tabelas originais para flexibilidade)
CREATE OR REPLACE PROCEDURE sp_focos_calor_estado(
    p_ano INTEGER DEFAULT 2025,
    p_id_estado INTEGER DEFAULT NULL,
    p_mes_inicio INTEGER DEFAULT 1,
    p_mes_fim INTEGER DEFAULT 12
)
LANGUAGE SQL
AS $$
SELECT 
    e.id_estado,
    e.estado AS nome_estado,
    f.satelite,
    EXTRACT(MONTH FROM f.data_hora) AS mes,
    COUNT(f.id_foco) AS total_focos,
    AVG(f.risco_fogo) AS media_risco_fogo,
    AVG(f.frp) AS media_frp
FROM tb_estados e
JOIN tb_municipios m ON e.id_estado = m.id_estado
JOIN tb_focos_calor f ON m.id_municipio = f.id_municipio
WHERE EXTRACT(YEAR FROM f.data_hora) = p_ano
    AND EXTRACT(MONTH FROM f.data_hora) BETWEEN p_mes_inicio AND p_mes_fim
    AND (p_id_estado IS NULL OR e.id_estado = p_id_estado)
GROUP BY e.id_estado, e.estado, f.satelite, EXTRACT(MONTH FROM f.data_hora)
ORDER BY e.id_estado, mes;
$$;

-- Função para atualizar a tabela materializada
CREATE OR REPLACE FUNCTION refresh_mat_focos_calor_estado()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW mat_focos_calor_estado;
END;
$$ LANGUAGE plpgsql;