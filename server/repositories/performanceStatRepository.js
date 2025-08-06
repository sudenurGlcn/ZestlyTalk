// src/repositories/PerformanceStatRepository.js



import db from '../models/index.js';  // default import

const { PerformanceStat } = db; // User modelini db nesnesinden al



class PerformanceStatRepository {
  async createStat(data) {
    return await PerformanceStat.create(data);
  }

  async getStatById(id) {
    return await PerformanceStat.findByPk(id);
  }

  async getStatsByUserId(user_id) {
    return await PerformanceStat.findAll({ where: { user_id } });
  }

  async updateStat(id, updatedData) {
    await PerformanceStat.update(updatedData, { where: { id } });
    return this.getStatById(id);
  }

  async deleteStat(id) {
    return await PerformanceStat.destroy({ where: { id } });
  }
}

export default new PerformanceStatRepository();
