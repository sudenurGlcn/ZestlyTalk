// src/services/scenarioService.js
import scenarioRepository from '../repositories/scenarioRepository.js';

class ScenarioService {
  async createScenario(data) {
    return await scenarioRepository.createScenario(data);
  }

  async getScenarioById(id) {
    return await scenarioRepository.getScenarioById(id);
  }

  async getAllScenarios() {
    return await scenarioRepository.getAllScenarios();
  }

  async updateScenario(id, updateData) {
    return await scenarioRepository.updateScenario(id, updateData);
  }

  async deleteScenario(id) {
    return await scenarioRepository.deleteScenario(id);
  }
  async getScenariosByCategory(category) {
    if (!category) {
      throw new Error('Category must be provided');
    }
    return await scenarioRepository.getScenariosByCategory(category);
  }
}

export default new ScenarioService();
