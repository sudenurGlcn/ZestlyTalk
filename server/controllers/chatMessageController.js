import chatMessageService from '../services/chatMessageService.js';

class ChatMessageController {
  async createMessage(req, res, next) {
    try {
      const message = await chatMessageService.createMessage(req.body);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  async getMessageById(req, res, next) {
    try {
      const message = await chatMessageService.getMessageById(req.params.id);
      if (!message) return res.status(404).json({ message: 'Message not found' });
      res.json(message);
    } catch (error) {
      next(error);
    }
  }

  async getMessagesByChatId(req, res, next) {
    try {
      const messages = await chatMessageService.getMessagesByChatId(req.params.chatId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  async updateMessage(req, res, next) {
    try {
      const updated = await chatMessageService.updateMessage(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      await chatMessageService.deleteMessage(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatMessageController();
