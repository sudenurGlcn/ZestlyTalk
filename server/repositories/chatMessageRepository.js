// src/repositories/ChatMessageRepository.js

import db from '../models/index.js';  // default import

const { ChatMessage } = db; // User modelini db nesnesinden al



class ChatMessageRepository {
  async createMessage(data) {
    return await ChatMessage.create(data);
  }

  async getMessageById(id) {
    return await ChatMessage.findByPk(id);
  }

  async getMessagesByChatId(chat_id) {
    return await ChatMessage.findAll({ where: { chat_id } });
  }

  async updateMessage(id, updatedData) {
    await ChatMessage.update(updatedData, { where: { id } });
    return this.getMessageById(id);
  }

  async deleteMessage(id) {
    return await ChatMessage.destroy({ where: { id } });
  }
}

export default new ChatMessageRepository();
