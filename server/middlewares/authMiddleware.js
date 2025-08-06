// src/middlewares/authMiddleware.js
import { verifyAccessToken } from '../utils/jwt.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Yetkisiz: Token yok veya hatalı format' });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { sub, email, iat, exp, role }
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Yetkisiz: Token geçersiz veya süresi dolmuş' });
  }
}

/**
 * Role bazlı yetkilendirme middleware’i.
 * @param  {...string} roles - İzin verilen roller
 * @returns {function} Express middleware
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Yetkisiz: Giriş yapılmamış' });
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
    next();
  };
}
