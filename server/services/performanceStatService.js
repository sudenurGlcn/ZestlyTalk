// src/services/performanceStatService.js
import performanceStatRepository from '../repositories/performanceStatRepository.js';

class PerformanceStatService {
  async createStat(data) {
    return await performanceStatRepository.createStat(data);
  }

  async getStatById(id) {
    return await performanceStatRepository.getStatById(id);
  }

  async getStatsByUserId(user_id) {
    return await performanceStatRepository.getStatsByUserId(user_id);
  }

  async updateStat(id, updateData) {
    return await performanceStatRepository.updateStat(id, updateData);
  }

  async deleteStat(id) {
    return await performanceStatRepository.deleteStat(id);
  }
}

export default new PerformanceStatService();
