// src/controllers/authController.js
import authService from '../services/authService.js';
import config from '../config/env.js';

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.login(email, password);

      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: config.node.env === 'production',
        sameSite: 'Strict',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        status: 'success',
        data: {
          user: data.user,
          accessToken: data.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      console.log('Refresh endpoint called');
      console.log('Cookies:', req.cookies);
      
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        console.log('No refresh token found in cookies');
        return res.status(401).json({ status: 'fail', message: 'Refresh token bulunamadı' });
      }

      console.log('Refresh token found, attempting to refresh...');
      const tokens = await authService.refresh(refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log('Tokens refreshed successfully');
      res.status(200).json({
        status: 'success',
        data: {
          accessToken: tokens.accessToken,
        },
      });
    } catch (error) {
      console.error('Refresh error:', error);
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      res.json({ user: req.user });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();