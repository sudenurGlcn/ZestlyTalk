// src/services/levelTestService.js
import levelTestRepository from '../repositories/levelTestRepository.js';

class LevelTestService {
  async createTest(data) {
    return await levelTestRepository.createTest(data);
  }

  async getTestById(id) {
    return await levelTestRepository.getTestById(id);
  }

  async getTestsByUserId(user_id) {
    return await levelTestRepository.getTestsByUserId(user_id);
  }

  async deleteTest(id) {
    return await levelTestRepository.deleteTest(id);
  }
}

export default new LevelTestService();
