// src/services/userService.js
import userRepository from '../repositories/userRepository.js';
import levelTestService from './levelTestService.js';

class UserService {
  async createUser(userData) {
    try {
      if (userData.level === 'blank') userData.level = null;

      const existing = await userRepository.getUserByEmail(userData.email);
      if (existing) throw new Error('Email zaten kayıtlı');

      return await userRepository.createUser(userData);
    } catch (err) {
      if (err.name === 'SequelizeValidationError') {
        const messages = err.errors.map(e => e.message);
        const error = new Error(messages.join(', '));
        error.status = 400;
        throw error;
      }
      throw err;
    }
  }

  async getUserById(id) {
    return await userRepository.getUserById(id);
  }

  async getAllUsers() {
    return await userRepository.getAllUsers();
  }

  async updateUser(id, updateData) {
    if (updateData.level === 'blank') updateData.level = null;

    if (updateData.password) {
      const user = await userRepository.getUserById(id);
      if (!user) return null;
      user.password = updateData.password;
      if (updateData.level !== undefined) user.level = updateData.level;
      await user.save();
      return user;
    }

    return await userRepository.updateUser(id, updateData);
  }

  async deleteUser(id) {
    return await userRepository.deleteUser(id);
  }

  async getUserByEmail(email) {
    return await userRepository.getUserByEmail(email);
  }

  async getUserByEmailWithPassword(email) {
    return await userRepository.getUserByEmailWithPassword(email);
  }

  async updatePassword(id, currentPassword, newPassword) {
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error('Kullanıcı bulunamadı');

    const isMatch = await user.validatePassword(currentPassword);
    if (!isMatch) throw new Error('Mevcut şifre yanlış');

    user.password = newPassword;
    await user.save();
    return user.toJSON();
  }

async updatePassword(id, currentPassword, newPassword) {
  const user = await userRepository.getUserByIdWithPassword(id);
  if (!user) throw new Error('Kullanıcı bulunamadı');

  const isMatch = await user.validatePassword(currentPassword);
  if (!isMatch) throw new Error('Mevcut şifre yanlış');

  user.password = newPassword;
  await user.save();
  return user.toJSON();
}

async setLevelFromTestResult(userId, testData) {
  const user = await userRepository.getUserById(userId);
  if (!user) throw new Error('Kullanıcı bulunamadı');

  // Seviye tespit kaydını oluştur
  await levelTestService.createTest({
    user_id: userId,
    result_level: testData.result_level,
    score: testData.score,
    details: testData.details || null,
  });

  // Kullanıcının seviyesini güncelle
  const updatedUser = await userRepository.updateUser(userId, { level: testData.result_level });

  return updatedUser;
}
}

export default new UserService();
