// Dados mock para as diferentes camadas do mapa

// Mock de focos de calor
export const mockFocosCalor = {
  type: 'FeatureCollection',
  features: [
    // Região Norte
    {
      type: 'Feature',
      properties: {
        frp: 85,
        data: '2023-10-15',
        risco: 'Alto',
        satelite: 'NOAA-20',
        municipio: 'Manaus',
      },
      geometry: {
        type: 'Point',
        coordinates: [-60.025, -3.118], // Manaus
      },
    },
    {
      type: 'Feature',
      properties: {
        frp: 92,
        data: '2023-10-14',
        risco: 'Muito Alto',
        satelite: 'AQUA',
        municipio: 'Belém',
      },
      geometry: {
        type: 'Point',
        coordinates: [-48.504, -1.456], // Belém
      },
    },
    // Região Nordeste
    {
      type: 'Feature',
      properties: {
        frp: 65,
        data: '2023-10-16',
        risco: 'Médio',
        satelite: 'TERRA',
        municipio: 'Recife',
      },
      geometry: {
        type: 'Point',
        coordinates: [-34.881, -8.053], // Recife
      },
    },
    // Região Centro-Oeste (cluster)
    ...Array(20)
      .fill(0)
      .map((_, i) => ({
        type: 'Feature',
        properties: {
          frp: 70 + Math.floor(Math.random() * 30),
          data: '2023-10-13',
          risco: 'Alto',
          satelite: 'TERRA',
          municipio: 'Brasília',
        },
        geometry: {
          type: 'Point',
          coordinates: [
            -47.929 + (Math.random() * 0.5 - 0.25),
            -15.78 + (Math.random() * 0.5 - 0.25),
          ], // Brasília com variação
        },
      })),
    // Região Sudeste
    {
      type: 'Feature',
      properties: {
        frp: 55,
        data: '2023-10-12',
        risco: 'Médio',
        satelite: 'NOAA-20',
        municipio: 'São Paulo',
      },
      geometry: {
        type: 'Point',
        coordinates: [-46.633, -23.55], // São Paulo
      },
    },
    // Região Sul
    {
      type: 'Feature',
      properties: {
        frp: 40,
        data: '2023-10-11',
        risco: 'Baixo',
        satelite: 'AQUA',
        municipio: 'Porto Alegre',
      },
      geometry: {
        type: 'Point',
        coordinates: [-51.23, -30.033], // Porto Alegre
      },
    },
  ],
};

// Mock de áreas de biomas
export const mockBiomas = {
  type: 'FeatureCollection',
  features: [
    // Amazônia (simplificada)
    {
      type: 'Feature',
      properties: {
        id: 1,
        nome_bioma: 'Amazônia',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-70.0, -5.0],
            [-70.0, -10.0],
            [-50.0, -10.0],
            [-50.0, -5.0],
            [-70.0, -5.0],
          ],
        ],
      },
    },
    // Cerrado (simplificado)
    {
      type: 'Feature',
      properties: {
        id: 3,
        nome_bioma: 'Cerrado',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-55.0, -12.0],
            [-55.0, -20.0],
            [-45.0, -20.0],
            [-45.0, -12.0],
            [-55.0, -12.0],
          ],
        ],
      },
    },
    // Mata Atlântica (simplificada)
    {
      type: 'Feature',
      properties: {
        id: 4,
        nome_bioma: 'Mata Atlântica',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-45.0, -20.0],
            [-45.0, -25.0],
            [-40.0, -25.0],
            [-40.0, -20.0],
            [-45.0, -20.0],
          ],
        ],
      },
    },
  ],
};

// Mock de áreas queimadas
export const mockAreasQueimadas = {
  type: 'FeatureCollection',
  features: [
    // Área queimada no Pantanal (simplificada)
    {
      type: 'Feature',
      properties: {
        area: 1250,
        data: '2023-09-20',
        severidade: 'Alta',
        bioma: 'Pantanal',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-57.0, -17.0],
            [-57.0, -17.5],
            [-56.5, -17.5],
            [-56.5, -17.0],
            [-57.0, -17.0],
          ],
        ],
      },
    },
    // Área queimada na Amazônia (simplificada)
    {
      type: 'Feature',
      properties: {
        area: 3200,
        data: '2023-09-22',
        severidade: 'Muito Alta',
        bioma: 'Amazônia',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.5, -5.0],
            [-62.5, -5.5],
            [-62.0, -5.5],
            [-62.0, -5.0],
            [-62.5, -5.0],
          ],
        ],
      },
    },
    // Área queimada no Cerrado (simplificada)
    {
      type: 'Feature',
      properties: {
        area: 850,
        data: '2023-09-18',
        severidade: 'Média',
        bioma: 'Cerrado',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-47.5, -15.5],
            [-47.5, -16.0],
            [-47.0, -16.0],
            [-47.0, -15.5],
            [-47.5, -15.5],
          ],
        ],
      },
    },
  ],
};

// Mock de dados de risco de fogo
export const mockRiscoFogo = {
  type: 'FeatureCollection',
  features: [
    // Área de alto risco no Mato Grosso
    {
      type: 'Feature',
      properties: {
        risco: 0.85,
        risco_nivel: 'Alto',
        data: '2023-10-15',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58.0, -12.0],
            [-58.0, -15.0],
            [-55.0, -15.0],
            [-55.0, -12.0],
            [-58.0, -12.0],
          ],
        ],
      },
    },
    // Área de médio risco em Goiás
    {
      type: 'Feature',
      properties: {
        risco: 0.55,
        risco_nivel: 'Médio',
        data: '2023-10-15',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-52.0, -15.0],
            [-52.0, -18.0],
            [-48.0, -18.0],
            [-48.0, -15.0],
            [-52.0, -15.0],
          ],
        ],
      },
    },
    // Área de baixo risco em São Paulo
    {
      type: 'Feature',
      properties: {
        risco: 0.25,
        risco_nivel: 'Baixo',
        data: '2023-10-15',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-48.0, -21.0],
            [-48.0, -24.0],
            [-45.0, -24.0],
            [-45.0, -21.0],
            [-48.0, -21.0],
          ],
        ],
      },
    },
  ],
};
