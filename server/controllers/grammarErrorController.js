import grammarErrorService from '../services/grammarErrorService.js';

class GrammarErrorController {
  async createError(req, res, next) {
    try {
      const error = await grammarErrorService.createError(req.body);
      res.status(201).json(error);
    } catch (err) {
      next(err);
    }
  }

  async getErrorById(req, res, next) {
    try {
      const error = await grammarErrorService.getErrorById(req.params.id);
      if (!error) return res.status(404).json({ message: 'Error not found' });
      res.json(error);
    } catch (err) {
      next(err);
    }
  }

  async getErrorsByChatId(req, res, next) {
    try {
      const errors = await grammarErrorService.getErrorsByChatId(req.params.chatId);
      res.json(errors);
    } catch (err) {
      next(err);
    }
  }

  async getErrorsByMessageId(req, res, next) {
    try {
      const errors = await grammarErrorService.getErrorsByMessageId(req.params.messageId);
      res.json(errors);
    } catch (err) {
      next(err);
    }
  }

  async deleteError(req, res, next) {
    try {
      await grammarErrorService.deleteError(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  /**
   * @param req.query.period: 'week' | 'month'
   */
  async getUserErrorTopicsByPeriod(req, res, next) {
    try {
      const userId = req.user.sub; 
      const { period } = req.query;

      if (!['week', 'month'].includes(period)) {
        return res.status(400).json({ message: 'Invalid period. Allowed: week, month' });
      }

      const now = new Date();
      let startDate;

      if (period === 'week') {
        // Haftanın başı (Pazartesi)
        const day = now.getDay(); 
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        startDate = new Date(now.setDate(diff));
        startDate.setHours(0,0,0,0);
      } else {
        // Ayın başı
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const endDate = new Date(); // Şimdiki zaman

      const topicsCount = await grammarErrorService.getErrorTopicsCountByUserIdAndDateRange(userId, startDate, endDate);

      res.json({ period, startDate, endDate, topicsCount });
    } catch (err) {
      next(err);
    }
  }
}

export default new GrammarErrorController();
