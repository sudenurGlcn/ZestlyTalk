// src/repositories/LevelTestRepository.js



import db from '../models/index.js';  

const { LevelTest } = db; 




class LevelTestRepository {
  async createTest(data) {
    return await LevelTest.create(data);
  }

  async getTestById(id) {
    return await LevelTest.findByPk(id);
  }

  async getTestsByUserId(user_id) {
    return await LevelTest.findAll({ where: { user_id } });
  }

  async deleteTest(id) {
    return await LevelTest.destroy({ where: { id } });
  }
}

export default new LevelTestRepository();
