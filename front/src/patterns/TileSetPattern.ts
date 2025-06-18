
export class TilesetPattern   {
  private sourceId = 'risco-fogo-geotiff-source';
  private layerId = 'risco-fogo-geotiff-layer';
  private initialized = false;

  async initialize(map: mapboxgl.Map): Promise<void> {
    try {
      if (this.initialized) return;

      // Aguarda o carregamento do estilo do mapa, se necessário
      if (!map.isStyleLoaded()) {
        await new Promise((resolve) => map.once('load', resolve));
      }

      // Adiciona um listener para erros do source
      map.on('error', (e) => {
        if (e.sourceId === this.sourceId) {
          console.error(`Failed to load tileset ${this.sourceId}:`, e.error);
        }
      });

      // Adiciona o source do tileset
      map.addSource(this.sourceId, {
        type: 'raster',
        url: 'mapbox://chrisf5m.0e3rcse2' // Confirme que este ID está correto
      });

      // Adiciona a camada raster
      map.addLayer({
        id: this.layerId,
        type: 'raster',
        source: this.sourceId,
        paint: {
          'raster-opacity': 0.5 // Aumentado para teste
        },
        layout: {
          visibility: 'none' // Inicialmente oculta
        }
      }, ''); // Adiciona no topo da pilha de camadas

      // Torna a camada visível para teste
      this.setVisibility(map, false);

      this.initialized = true;
      console.log('Tileset pattern initialized');
      console.log('Source:', map.getSource(this.sourceId));
      console.log('Layer:', map.getLayer(this.layerId));
    } catch (error) {
      console.error('Failed to initialize tileset pattern:', error);
      throw error;
    }
  }

  setVisibility(map: mapboxgl.Map, visible: boolean): void {
    console.log(`Setting visibility of layer ${this.layerId} to ${visible}`);
    const visibility = visible ? 'visible' : 'none';
    if (map.getLayer(this.layerId)) {
      map.setLayoutProperty(this.layerId, 'visibility', visibility);
      console.log(`Layer ${this.layerId} visibility set to ${visibility}`);
    } else {
      console.error(`Layer ${this.layerId} not found`);
    }
  }

  update(map: mapboxgl.Map, data: any): void {
  }
}