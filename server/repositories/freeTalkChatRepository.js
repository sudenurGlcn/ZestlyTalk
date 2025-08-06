// src/repositories/freeTalkChatRepository.js
import db from '../models/index.js';

const { Chat } = db;

class FreeTalkChatRepository {
  async createFreeTalkChat(data) {
    
    return await Chat.create({
      user_id: data.user_id,
      status: 'active',
      progress: {},
      ...data,
    });
  }

  async getChatById(id) {
    return await Chat.findByPk(id, {
      include: [
        {
          model: db.ChatMessage,
          as: 'messages',
          attributes: ['sender', 'message'],
          order: [['createdAt', 'ASC']],
        },
      ],
    });
  }
}

export default new FreeTalkChatRepository();
