import chatService from '../services/chatService.js';

class ChatController {
  async createChat(req, res, next) {
    try {
      const result = await chatService.createChat(req.body);
      
      // result = { chatId, response, chat, initialMessageId }
      res.status(201).json({
        chatId: result.chatId,
        response: result.response,
        
      });
    } catch (error) {
      next(error);
    }
  }
  async getChatById(req, res, next) {
    try {
      const chat = await chatService.getChatById(req.params.id);
      if (!chat) return res.status(404).json({ message: 'Chat not found' });
      res.json(chat);
    } catch (error) {
      next(error);
    }
  }

  async getChatsByUserId(req, res, next) {
    try {
      const chats = await chatService.getChatsByUserId(req.params.userId);
      res.json(chats);
    } catch (error) {
      next(error);
    }
  }

  async getChatsByScenarioId(req, res, next) {
    try {
      const chats = await chatService.getChatsByScenarioId(req.params.scenarioId);
      res.json(chats);
    } catch (error) {
      next(error);
    }
  }

  async updateChat(req, res, next) {
    try {
      const updated = await chatService.updateChat(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteChat(req, res, next) {
    try {
      await chatService.deleteChat(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getActiveChatsByUserId(req, res, next) {
  try {
    const { userId } = req.params;
    const chats = await chatService.getActiveChatsByUserId(userId);
    res.json(chats);
  } catch (error) {
    next(error);
  }
}

async getOrCreateChat(req, res, next) {
    try {
      const { userId, scenarioId } = req.body;

      if (!userId || !scenarioId) {
        return res.status(400).json({ error: 'userId ve scenarioId zorunludur' });
      }

      const result = await chatService.getOrCreateActiveChat(userId, scenarioId);

      res.json(result);
    } catch (err) {
      console.error('getOrCreateChat error:', err);
      res.status(500).json({ error: 'Chat alınamadı veya oluşturulamadı' });
    }
  }

  async getActiveAndCompletedChatsByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const chats = await chatService.getChatsByUserIdAndStatuses(userId, ['active', 'completed']);
      res.json(chats);
    } catch (error) {
      next(error);
    }
  }

  async forceCreateNewChat(req, res, next) {
  try {
    const { userId, scenarioId } = req.body;

    if (!userId || !scenarioId) {
      return res.status(400).json({ error: 'userId ve scenarioId zorunludur' });
    }

    const result = await chatService.forceCreateNewChat(userId, scenarioId);

    res.status(201).json(result);
  } catch (err) {
    console.error('forceCreateNewChat error:', err);
    res.status(500).json({ error: 'Yeni chat oluşturulamadı' });
  }
}

async getRadarScores(req, res, next) {
  try {
    const { userId } = req.params;
    const { period } = req.query;

    if (period && !['week', 'month'].includes(period)) {
      return res.status(400).json({ message: 'Invalid period. Allowed: week, month' });
    }

    const scores = await chatService.calculateLanguageRadarScores(userId, period);
    res.json(scores);
  } catch (error) {
    next(error);
  }
}
}

export default new ChatController();
