CREATE TABLE "tb_biomas" (
  "id_bioma" int PRIMARY KEY,
  "bioma" varchar NOT NULL,
  "geo_bioma" geometry(multipolygon) NOT NULL
);

CREATE TABLE "tb_estados" (
  "id_estado" int PRIMARY KEY,
  "estado" varchar NOT NULL,
  "geo_estado" geometry(multipolygon) NOT NULL
);

CREATE TABLE "tb_municipios" (
  "id_municipio" int PRIMARY KEY,
  "estado_id" int NOT NULL,
  "municipio" varchar NOT NULL,
  "geo_municipio" geometry(muntipolugon) NOT NULL
);

CREATE TABLE "tb_focos_calor" (
  "id_foco" varchar PRIMARY KEY,
  "municipio_id" int,
  "bioma_id" int,
  "lat" float NOT NULL,
  "lon" float NOT NULL,
  "data_hora_gmt" timestamp NOT NULL,
  "satelite" varchar NOT NULL,
  "risco_fogo" float
);

CREATE TABLE "tb_area_queimada" (
  "id_area_queimada" serial PRIMARY KEY,
  "mes_referencia" date NOT NULL,
  "geo_area_queimada" geometry(multipolygon) NOT NULL
);

CREATE TABLE "tb_risco_de_fogo" (
  "id_risco_de_fogo" serial PRIMARY KEY,
  "mes_referencia" date NOT NULL,
  "geo_area_queimada" geometry(multipolygon) NOT NULL
);

ALTER TABLE "tb_focos_calor" ADD FOREIGN KEY ("bioma_id") REFERENCES "tb_biomas" ("id_bioma");

ALTER TABLE "tb_focos_calor" ADD FOREIGN KEY ("municipio_id") REFERENCES "tb_municipios" ("id_municipio");

ALTER TABLE "tb_municipios" ADD FOREIGN KEY ("estado_id") REFERENCES "tb_estados" ("id_estado");
