// src/repositories/ScenarioRepository.js
import db from '../models/index.js';  // default import

const { Scenario } = db; // User modelini db nesnesinden al

class ScenarioRepository {
  async createScenario(data) {
    return await Scenario.create(data);
  }

  async getScenarioById(id) {
    return await Scenario.findByPk(id);
  }

  async getAllScenarios() {
  return await Scenario.findAll({
    attributes: ['id', 'title', 'difficulty_level', 'category'],
  });
}

  async updateScenario(id, updatedData) {
    await Scenario.update(updatedData, { where: { id } });
    return this.getScenarioById(id);
  }

  async deleteScenario(id) {
    return await Scenario.destroy({ where: { id } });
  }
  async getScenariosByCategory(category) {
  if (!category) {
    throw new Error('Category must be provided');
  }

  return await Scenario.findAll({
    where: { category },
    attributes: ['id', 'title', 'difficulty_level', 'category'], // sadece gerekli alanları getir
  });
}
}

export default new ScenarioRepository();
