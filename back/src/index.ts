export * from "./types";
export * from "./models";
export * from "./repositories";

/*project/
├── types/
│   ├── Estado.ts
│   ├── Municipio.ts
│   ├── Bioma.ts
│   ├── FocoCalor.ts
│   ├── AreaQueimada.ts
│   └── index.ts         # Barrel file for types
├── models/
│   ├── base/
│   │   └── GeoEntity.ts  # Abstract base class
│   ├── EstadoModel.ts
│   ├── MunicipioModel.ts
│   ├── BiomaModel.ts
│   ├── FocoCalorModel.ts
│   ├── AreaQueimadaModel.ts
│   └── index.ts         # Barrel file for models
├── repositories/
│   ├── DataRepository.ts # Data access layer
│   └── index.ts         # Barrel file for repositories
└── index.ts             # Main barrel file
*/
