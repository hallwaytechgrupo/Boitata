export abstract class GeoEntity {
  constructor(protected geoData: GeoJSON.MultiPolygon) {}

  getGeoData(): GeoJSON.MultiPolygon {
    return this.geoData;
  }
}
