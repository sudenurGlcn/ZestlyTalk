// src/controllers/freeTalkChatController.js
import freeTalkChatService from '../services/freeTalkChatService.js';

class FreeTalkChatController {
  /**
   * POST /api/free-talk-chat/create
   * Body: { user_id: number }
   */
  async createChat(req, res, next) {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        return res.status(400).json({ error: 'user_id zorunludur' });
      }

      const result = await freeTalkChatService.createFreeTalkChat({ user_id });

      res.status(201).json({
        chatId: result.chatId,
        firstMessage: result.firstMessage,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/free-talk-chat/:chatId
   * Chat ve mesajları döner
   */
  async getChat(req, res, next) {
    try {
      const { chatId } = req.params;

      const chat = await freeTalkChatService.getChatById(chatId);

      if (!chat) {
        return res.status(404).json({ error: 'Chat bulunamadı' });
      }

      res.json(chat);
    } catch (error) {
      next(error);
    }
  }
}

export default new FreeTalkChatController();
