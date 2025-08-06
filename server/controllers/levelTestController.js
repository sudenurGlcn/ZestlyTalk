import levelTestService from '../services/levelTestService.js';

class LevelTestController {
  async createTest(req, res, next) {
    try {
      const test = await levelTestService.createTest(req.body);
      res.status(201).json(test);
    } catch (err) {
      next(err);
    }
  }

  async getTestById(req, res, next) {
    try {
      const test = await levelTestService.getTestById(req.params.id);
      if (!test) return res.status(404).json({ message: 'Test not found' });
      res.json(test);
    } catch (err) {
      next(err);
    }
  }

  async getTestsByUserId(req, res, next) {
    try {
      const tests = await levelTestService.getTestsByUserId(req.params.userId);
      res.json(tests);
    } catch (err) {
      next(err);
    }
  }

  async deleteTest(req, res, next) {
    try {
      await levelTestService.deleteTest(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default new LevelTestController();
