// src/services/grammarErrorService.js
import grammarErrorRepository from '../repositories/grammarErrorRepository.js';

class GrammarErrorService {
  async createError(data) {
    return await grammarErrorRepository.createError(data);
  }

  async getErrorById(id) {
    return await grammarErrorRepository.getErrorById(id);
  }

  async getErrorsByChatId(chat_id) {
    return await grammarErrorRepository.getErrorsByChatId(chat_id);
  }

  async getErrorsByMessageId(message_id) {
    return await grammarErrorRepository.getErrorsByMessageId(message_id);
  }

  async deleteError(id) {
    return await grammarErrorRepository.deleteError(id);
  }
    async createErrorsBulk(errors) {
    return await grammarErrorRepository.createErrorsBulk(errors);
  }

  async getErrorTopicsCountByUserIdAndDateRange(userId, startDate, endDate) {
    return await grammarErrorRepository.getErrorTopicsCountByUserIdAndDateRange(userId, startDate, endDate);
  }
}

export default new GrammarErrorService();
