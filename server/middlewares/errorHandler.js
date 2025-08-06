// src/middlewares/errorHandler.js
/**
 * Merkezi error handler middleware.
 * JSON formatında standart error döner.
 */
export default function errorHandler(err, req, res, next) {
  console.error(err);

  // İstersen hata tiplerine göre genişletebilirsin (Sequelize vs)
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ message });
}
