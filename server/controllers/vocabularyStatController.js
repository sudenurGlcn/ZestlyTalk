import vocabularyStatService from '../services/vocabularyStatService.js';

class VocabularyStatController {
  async createStat(req, res, next) {
    try {
      const stat = await vocabularyStatService.createStat(req.body);
      res.status(201).json(stat);
    } catch (err) {
      next(err);
    }
  }

  async getStatById(req, res, next) {
    try {
      const stat = await vocabularyStatService.getStatById(req.params.id);
      if (!stat) return res.status(404).json({ message: 'Stat not found' });
      res.json(stat);
    } catch (err) {
      next(err);
    }
  }

  async getStatsByUserId(req, res, next) {
    try {
      const stats = await vocabularyStatService.getStatsByUserId(req.params.userId);
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }

  async updateStat(req, res, next) {
    try {
      const updated = await vocabularyStatService.updateStat(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteStat(req, res, next) {
    try {
      await vocabularyStatService.deleteStat(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new VocabularyStatController();
