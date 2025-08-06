// src/repositories/GrammarErrorRepository.js

import { Op, fn, col } from 'sequelize';
import db from '../models/index.js';  // default import

const { GrammarError, Chat } = db;


class GrammarErrorRepository {
  async createError(data) {
    return await GrammarError.create(data);
  }

  async getErrorById(id) {
    return await GrammarError.findByPk(id);
  }

  async getErrorsByChatId(chat_id) {
    return await GrammarError.findAll({ where: { chat_id } });
  }

  async getErrorsByMessageId(message_id) {
    return await GrammarError.findAll({ where: { message_id } });
  }

  async deleteError(id) {
    return await GrammarError.destroy({ where: { id } });
  }
   async createErrorsBulk(errors) {
    return await GrammarError.bulkCreate(errors);
  }

  /**
   * Belirli userId için verilen tarih aralığında
   * topic bazında hata sayısını getirir
   * @param {number} userId 
   * @param {Date} startDate 
   * @param {Date} endDate 
   * @returns [{ error_topic: string, total_errors: number }]
   */
  async getErrorTopicsCountByUserIdAndDateRange(userId, startDate, endDate) {
    return await GrammarError.findAll({
      attributes: [
        'error_topic',
        [fn('COUNT', col('error_topic')), 'total_errors']
      ],
      include: [{
        model: Chat,
        as: 'chat',
        attributes: [],
        where: { user_id: userId }
      }],
      where: {
        created_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: ['error_topic'],
      raw: true
    });
  }

}

export default new GrammarErrorRepository();
