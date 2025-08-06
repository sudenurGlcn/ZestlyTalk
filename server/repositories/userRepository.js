// src/repositories/userRepository.js
import db from '../models/index.js';

const { User } = db;

export default new class UserRepository {
  constructor() {
    this.User = User;
  }

  async createUser(data) {
    return await this.User.create(data);
  }

  async getUserById(id) {
    return await this.User.findByPk(id);
  }

  async getUserByEmail(email) {
    return await this.User.findOne({ where: { email } });
  }

  async getAllUsers() {
    return await this.User.findAll();
  }

  async updateUser(id, updatedData) {
    await this.User.update(updatedData, { where: { id } });
    return this.getUserById(id);
  }

  async deleteUser(id) {
    return await this.User.destroy({ where: { id } });
  }

  async getUserByEmailWithPassword(email) {
    return await this.User.scope('withPassword').findOne({ where: { email } });
  }

  async getUserByIdWithPassword(id) {
  return await this.User.scope('withPassword').findByPk(id);
}
};
