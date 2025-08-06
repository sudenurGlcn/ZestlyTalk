import userService from '../services/userService.js';

class UserController {
  async createUser(req, res, next) {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const updatedUser = await userService.updatePassword(req.params.id, currentPassword, newPassword);
      res.json({ message: 'Password updated successfully', user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async updateEmail(req, res, next) {
    try {
      const { newEmail } = req.body;
      const updatedUser = await userService.updateEmail(req.params.id, newEmail);
      res.json({ message: 'Email updated successfully', user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async setLevelFromTestResult(req, res, next) {
  try {
    const { result_level, score, details } = req.body;
    const userId = parseInt(req.params.id, 10);

    if (!result_level || !score) {
      return res.status(400).json({ message: 'result_level ve score zorunludur' });
    }

    const updatedUser = await userService.setLevelFromTestResult(userId, { result_level, score, details });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}
}

export default new UserController();
