import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.accessSecret);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.jwt.refreshSecret);
}
