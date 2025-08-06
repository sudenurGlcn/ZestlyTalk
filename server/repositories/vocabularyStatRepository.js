// src/repositories/VocabularyStatRepository.js



import db from '../models/index.js';  
import { Op } from 'sequelize';

const { VocabularyStat } = db; 

class VocabularyStatRepository {
  async createStat(data) {
    return await VocabularyStat.create(data);
  }

  async getStatById(id) {
    return await VocabularyStat.findByPk(id);
  }

  async getStatsByUserId(user_id) {
    return await VocabularyStat.findAll({ where: { user_id } });
  }

  async updateStat(id, updatedData) {
    await VocabularyStat.update(updatedData, { where: { id } });
    return this.getStatById(id);
  }

  async deleteStat(id) {
    return await VocabularyStat.destroy({ where: { id } });
  }
  async createOrUpdateStatsBulk(user_id, stats) {
    const words = stats.map(s => s.word);

    const existingStats = await VocabularyStat.findAll({
      where: {
        user_id,
        word: { [Op.in]: words },
      },
    });

    const toUpdate = [];
    const toCreate = [];

    for (const stat of stats) {
      const existing = existingStats.find(e => e.word === stat.word);
      if (existing) {
        toUpdate.push({
          id: existing.id,
          frequency: existing.frequency + 1,
          context_sentence: stat.context_sentence, 
          suggestions: stat.suggestions,
          last_used: new Date(),
        });
      } else {
        toCreate.push({
          user_id,
          word: stat.word,
          frequency: 1,
          context_sentence: stat.context_sentence,
          suggestions: stat.suggestions,
          last_used: new Date(),
        });
      }
    }

    // Toplu güncelleme
    for (const item of toUpdate) {
      await VocabularyStat.update(
        {
          frequency: item.frequency,
          context_sentence: item.context_sentence,
          suggestions: item.suggestions,
          last_used: item.last_used,
        },
        { where: { id: item.id } }
      );
    }

    // Toplu ekleme
    if (toCreate.length > 0) {
      await VocabularyStat.bulkCreate(toCreate);
    }
  }
}

export default new VocabularyStatRepository();
