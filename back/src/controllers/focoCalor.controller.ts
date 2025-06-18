import type { Request, Response } from 'express';
import { FocoCalorService } from '../services/focoCalor.service';

const focoCalorService = new FocoCalorService();

export class FocoCalorController {
  async getGraficoData(req: Request, res: Response): Promise<void> {
    const { ano, mes } = req.query;
    try {
      const data = await focoCalorService.getGraficoData(
        ano ? Number(ano) : undefined,
        mes ? Number(mes) : undefined,
      );

      res.json(data);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  async getFocosByMunicipioId(req: Request, res: Response) {
    try {
      const { municipioId } = req.params;
      const { dataInicio, dataFim } = req.query;

      const focos = await focoCalorService.getFocosByMunicipio(
        municipioId,
        dataInicio as string,
        dataFim as string,
      );

      return res.json(focos);
    } catch (error) {
      console.error('Erro ao processar requisição:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getFocosByEstado(req: Request, res: Response): Promise<void> {
    const { estadoId } = req.params;

    const { dataInicio, dataFim } = req.query;

    console.log(estadoId, dataInicio, dataFim);

    try {
      const focos = await focoCalorService.getFocosByEstado(
        Number(estadoId),
        dataInicio ? String(dataInicio) : undefined,
        dataFim ? String(dataFim) : undefined,
      );

      res.json(focos);
    } catch (error) {
      console.error('Erro ao buscar focos de calor:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  async getFocosByBioma(req: Request, res: Response): Promise<void> {
    const { biomaId } = req.params;
    const { dataInicio, dataFim } = req.query;

    try {
      const focos = await focoCalorService.getFocosByBioma(
        Number(biomaId),
        dataInicio ? String(dataInicio) : undefined,
        dataFim ? String(dataFim) : undefined,
      );

      res.json(focos);
    } catch (error) {
      console.error('Erro ao buscar focos de calor:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  async getBasicInfoByEstado(req: Request, res: Response): Promise<void> {
    const { estadoId } = req.params;

    try {
      const info = await focoCalorService.getBasicInfoByEstado(
        Number(estadoId),
      );

      res.json(info);
    } catch (error) {
      console.error('Erro ao buscar informações básicas:', error);
      res.status(500).send('Erro no servidor');
    }
  }

  async getEstatisticasBioma(req: Request, res: Response) {
    try {
      const { biomaId } = req.params;
      const id = biomaId ? Number.parseInt(biomaId) : undefined;

      const estatisticas = await focoCalorService.getEstatisticasBioma(id);

      return res.json(estatisticas);
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas do bioma:', error);
      return res
        .status(500)
        .json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getEstatisticasMunicipio(req: Request, res: Response) {
    try {
      const { municipioId } = req.params;
      const id = municipioId ? Number.parseInt(municipioId) : undefined;

      const estatisticas = await focoCalorService.getEstatisticasMunicipio(id);

      return res.json(estatisticas);
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas do município:', error);
      return res
        .status(500)
        .json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getEstatisticasEstado(req: Request, res: Response) {
    try {
      const { estadoId } = req.params;
      const id = estadoId ? Number.parseInt(estadoId) : undefined;

      const estatisticas = await focoCalorService.getEstatisticasEstado(id);

      return res.json(estatisticas);
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas do estado:', error);
      return res
        .status(500)
        .json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getDashboardResumo(req: Request, res: Response) {
    try {
      const resumo = await focoCalorService.getResumoDashboard();

      return res.json(resumo);
    } catch (error: any) {
      console.error('Erro ao buscar resumo do dashboard:', error);
      return res
        .status(500)
        .json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getEstatisticasEstadoFinal(req: Request, res: Response) {
    try {
      const { estadoId } = req.params;
      const id = estadoId ? Number.parseInt(estadoId) : undefined;
      const result = await focoCalorService.getEstatisticasEstadoFinal(id);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas finais do estado:', error);
      return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getKpiTotalFocosEstado(req: Request, res: Response) {
    try {
      const { estadoId } = req.params;
      const id = estadoId ? Number.parseInt(estadoId) : undefined;
      const result = await focoCalorService.getKpiTotalFocosEstado(id);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro ao buscar KPI total de focos do estado:', error);
      return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getKpiMesMaiorFocos(req: Request, res: Response) {
    try {
      const { estadoId } = req.params;
      const id = estadoId ? Number.parseInt(estadoId) : undefined;
      const result = await focoCalorService.getKpiMesMaiorFocos(id);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro ao buscar KPI mês com maior número de focos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getKpiRiscoMedioEstado(req: Request, res: Response) {
    try {
      const { estadoId } = req.params;
      const id = estadoId ? Number.parseInt(estadoId) : undefined;
      const result = await focoCalorService.getKpiRiscoMedioEstado(id);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro ao buscar KPI risco médio do estado:', error);
      return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getKpiFocosPorSatelite(req: Request, res: Response) {
    try {
      const { estadoId } = req.params;
      const id = estadoId ? Number.parseInt(estadoId) : undefined;
      const result = await focoCalorService.getKpiFocosPorSatelite(id);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro ao buscar KPI focos por satélite:', error);
      return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getGraficoEvolucaoTemporal(req: Request, res: Response) {
    try {
      const { estadoId } = req.params;
      const id = estadoId ? Number.parseInt(estadoId) : undefined;
      const result = await focoCalorService.getGraficoEvolucaoTemporal(id);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro ao buscar gráfico de evolução temporal:', error);
      return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getGraficoComparacaoSatelite(req: Request, res: Response) {
    try {
      const { estadoId } = req.params;
      const id = estadoId ? Number.parseInt(estadoId) : undefined;
      const result = await focoCalorService.getGraficoComparacaoSatelite(id);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro ao buscar gráfico de comparação de satélite:', error);
      return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getGraficoDistribuicaoEstado(req: Request, res: Response) {
    try {
      const { estadoId } = req.params;
      const id = estadoId ? Number.parseInt(estadoId) : undefined;
      const result = await focoCalorService.getGraficoDistribuicaoEstado(id);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro ao buscar gráfico de distribuição do estado:', error);
      return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  async getGraficoCorrelacaoRiscoFocos(req: Request, res: Response) {
    try {
      const { estadoId } = req.params;
      const id = estadoId ? Number.parseInt(estadoId) : undefined;
      const result = await focoCalorService.getGraficoCorrelacaoRiscoFocos(id);
      return res.json(result);
    } catch (error: any) {
      console.error('Erro ao buscar gráfico de correlação risco-focos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }
}
