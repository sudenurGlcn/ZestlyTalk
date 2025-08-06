// src/services/authService.js
import userService from './userService.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

class AuthService {
  async login(email, password) {
    const user = await userService.getUserByEmailWithPassword(email);
    if (!user) throw new Error('Geçersiz e-posta veya parola');

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) throw new Error('Geçersiz e-posta veya parola');

    const payload = { sub: user.id };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  async refresh(token) {
    const decoded = verifyRefreshToken(token);
    const payload = {
      sub: decoded.sub,
      email: decoded.email,
    };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}

export default new AuthService();
