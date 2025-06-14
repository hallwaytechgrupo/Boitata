import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Point, Polygon, MultiPolygon } from 'geojson';

/**
 * Classe base para entidades que possuem informações geográficas.
 * Contém colunas comuns a todas as entidades espaciais, como ID e localização.
 */
@Entity()
export abstract class GeoEntity {
  @PrimaryGeneratedColumn()
  id!: number; // Use "!" para indicar que o TypeORM irá inicializar

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point', // Pode ser sobrescrito nas classes filhas
    srid: 4326,
    nullable: true,
  })
  localizacao!: Point | Polygon | MultiPolygon; // Use "!" para evitar erro de inicialização

  // Outras colunas comuns podem ser adicionadas aqui
}