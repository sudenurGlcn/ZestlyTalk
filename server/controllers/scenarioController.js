import scenarioService from '../services/scenarioService.js';

class ScenarioController {
  async createScenario(req, res, next) {
    try {
      const scenario = await scenarioService.createScenario(req.body);
      res.status(201).json(scenario);
    } catch (error) {
      next(error);
    }
  }

  async getScenarioById(req, res, next) {
    try {
      const scenario = await scenarioService.getScenarioById(req.params.id);
      if (!scenario) return res.status(404).json({ message: 'Scenario not found' });
      res.json(scenario);
    } catch (error) {
      next(error);
    }
  }

  async getAllScenarios(req, res, next) {
    try {
      const scenarios = await scenarioService.getAllScenarios();
      res.json(scenarios);
    } catch (error) {
      next(error);
    }
  }

  async updateScenario(req, res, next) {
    try {
      const updated = await scenarioService.updateScenario(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteScenario(req, res, next) {
    try {
      await scenarioService.deleteScenario(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getScenariosByCategory(req, res, next) {
    try {
      const { category } = req.query; // text olarak frontend query parametresiyle gönderiyor
      if (!category) {
        return res.status(400).json({ message: 'Category is required' });
      }

      const scenarios = await scenarioService.getScenariosByCategory(category);
      res.json(scenarios);
    } catch (error) {
      next(error);
    }
  }
}

export default new ScenarioController();
