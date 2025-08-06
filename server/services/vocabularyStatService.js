// src/services/vocabularyStatService.js
import vocabularyStatRepository from '../repositories/vocabularyStatRepository.js';
import { Op } from 'sequelize';

class VocabularyStatService {
  async createStat(data) {
    return await vocabularyStatRepository.createStat(data);
  }

  async getStatById(id) {
    return await vocabularyStatRepository.getStatById(id);
  }

  async getStatsByUserId(user_id) {
    return await vocabularyStatRepository.getStatsByUserId(user_id);
  }

  async updateStat(id, updateData) {
    return await vocabularyStatRepository.updateStat(id, updateData);
  }

  async deleteStat(id) {
    return await vocabularyStatRepository.deleteStat(id);
  }
  async createOrUpdateStatsBulk(user_id, stats) {
    return await vocabularyStatRepository.createOrUpdateStatsBulk(user_id, stats);
  }
}

export default new VocabularyStatService();
