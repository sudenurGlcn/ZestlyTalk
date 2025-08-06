// src/services/chatMessageService.js
import chatMessageRepository from '../repositories/chatMessageRepository.js';

class ChatMessageService {
  async createMessage(data) {
    return await chatMessageRepository.createMessage(data);
  }

  async getMessageById(id) {
    return await chatMessageRepository.getMessageById(id);
  }

  async getMessagesByChatId(chat_id) {
    return await chatMessageRepository.getMessagesByChatId(chat_id);
  }

  async updateMessage(id, updateData) {
    return await chatMessageRepository.updateMessage(id, updateData);
  }

  async deleteMessage(id) {
    return await chatMessageRepository.deleteMessage(id);
  }
}

export default new ChatMessageService();
