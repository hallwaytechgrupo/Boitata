// Dados mock para focos de calor
export const focosMockData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-50.5, -10.2],
      },
      properties: {
        intensity: 0.8,
        date: "2023-04-15",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-51.3, -9.8],
      },
      properties: {
        intensity: 0.9,
        date: "2023-04-15",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-49.8, -10.5],
      },
      properties: {
        intensity: 0.7,
        date: "2023-04-16",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-48.9, -11.2],
      },
      properties: {
        intensity: 0.85,
        date: "2023-04-16",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-47.5, -12.1],
      },
      properties: {
        intensity: 0.75,
        date: "2023-04-17",
      },
    },
    // Região Pantanal
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-56.5, -17.2],
      },
      properties: {
        intensity: 0.9,
        date: "2023-04-15",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-57.3, -16.8],
      },
      properties: {
        intensity: 0.95,
        date: "2023-04-15",
      },
    },
    // Região Cerrado
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-47.8, -15.5],
      },
      properties: {
        intensity: 0.8,
        date: "2023-04-16",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-46.9, -16.2],
      },
      properties: {
        intensity: 0.7,
        date: "2023-04-16",
      },
    },
    // Mais 20 pontos espalhados pelo Brasil
    ...Array(20)
      .fill(0)
      .map((_, i) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [-60 + Math.random() * 20, -20 + Math.random() * 15],
        },
        properties: {
          intensity: 0.5 + Math.random() * 0.5,
          date: `2023-04-${15 + Math.floor(Math.random() * 5)}`,
        },
      })),
  ],
}

// Dados mock para risco de fogo (polígonos com gradiente)
export const riscoFogoMockData = {
  type: "FeatureCollection",
  features: [
    // Área de alto risco na Amazônia
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-52, -8],
            [-50, -8],
            [-50, -10],
            [-52, -10],
            [-52, -8],
          ],
        ],
      },
      properties: {
        riskLevel: "alto",
        fillColor: "#FF4500",
      },
    },
    // Área de médio risco no Cerrado
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-48, -15],
            [-46, -15],
            [-46, -17],
            [-48, -17],
            [-48, -15],
          ],
        ],
      },
      properties: {
        riskLevel: "medio",
        fillColor: "#FFA500",
      },
    },
    // Área de baixo risco na Mata Atlântica
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-44, -22],
            [-42, -22],
            [-42, -24],
            [-44, -24],
            [-44, -22],
          ],
        ],
      },
      properties: {
        riskLevel: "baixo",
        fillColor: "#FFFF00",
      },
    },
    // Área de crítico risco no Pantanal
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-57, -17],
            [-55, -17],
            [-55, -19],
            [-57, -19],
            [-57, -17],
          ],
        ],
      },
      properties: {
        riskLevel: "critico",
        fillColor: "#FF0000",
      },
    },
  ],
}

// Dados mock para área queimada (polígonos)
export const areaQueimadaMockData = {
  type: "FeatureCollection",
  features: [
    // Área queimada na Amazônia
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-51, -9],
            [-50, -9],
            [-50, -10],
            [-51, -10],
            [-51, -9],
          ],
        ],
      },
      properties: {
        area: 120.5, // km²
        date: "2023-04-15",
        biome: "Amazônia",
      },
    },
    // Área queimada no Pantanal
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-56.5, -17.5],
            [-56, -17.5],
            [-56, -18],
            [-56.5, -18],
            [-56.5, -17.5],
          ],
        ],
      },
      properties: {
        area: 85.3, // km²
        date: "2023-04-16",
        biome: "Pantanal",
      },
    },
    // Área queimada no Cerrado
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-47.5, -15.5],
            [-47, -15.5],
            [-47, -16],
            [-47.5, -16],
            [-47.5, -15.5],
          ],
        ],
      },
      properties: {
        area: 62.8, // km²
        date: "2023-04-17",
        biome: "Cerrado",
      },
    },
  ],
}

// Dados para gráficos
export const monthlyFireRiskData = [
  { month: "Jan", risk: 30 },
  { month: "Fev", risk: 40 },
  { month: "Mar", risk: 45 },
  { month: "Abr", risk: 70 },
  { month: "Mai", risk: 85 },
  { month: "Jun", risk: 90 },
  { month: "Jul", risk: 100 },
  { month: "Ago", risk: 95 },
  { month: "Set", risk: 80 },
  { month: "Out", risk: 65 },
  { month: "Nov", risk: 50 },
  { month: "Dez", risk: 35 },
]

export const riskVsBurnedAreaData = [
  { risk: 20, area: 50, state: "SP" },
  { risk: 30, area: 80, state: "MG" },
  { risk: 40, area: 100, state: "GO" },
  { risk: 50, area: 150, state: "MT" },
  { risk: 60, area: 180, state: "PA" },
  { risk: 70, area: 250, state: "AM" },
  { risk: 80, area: 300, state: "RO" },
  { risk: 90, area: 380, state: "TO" },
  { risk: 95, area: 450, state: "MS" },
]

export const firesByStateData = [
  { state: "AM", fires: 1245 },
  { state: "PA", fires: 980 },
  { state: "MT", fires: 876 },
  { state: "RO", fires: 654 },
  { state: "TO", fires: 543 },
  { state: "MA", fires: 432 },
  { state: "PI", fires: 321 },
  { state: "GO", fires: 234 },
]

export const firesByBiomeData = [
  { biome: "Amazônia", fires: 2450 },
  { biome: "Cerrado", fires: 1870 },
  { biome: "Pantanal", fires: 980 },
  { biome: "Caatinga", fires: 540 },
  { biome: "Mata Atlântica", fires: 320 },
  { biome: "Pampa", fires: 150 },
]
