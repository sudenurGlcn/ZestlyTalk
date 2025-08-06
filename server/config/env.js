// env.js (ESM version of your config file)
import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    console.warn(`⚠️ Environment variable ${key} is not set.`);
  }
  return value;
}

const config = {
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  },
  node: {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
  },
  db: {
    host: requireEnv('DB_HOST'),
    port: Number(process.env.DB_PORT || 5432),
    database: requireEnv('DB_NAME'),
    username: requireEnv('DB_USER'),
    password: requireEnv('DB_PASS'),
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  gemini: {
    apiKey: requireEnv('GEMINI_API_KEY'),
    apiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta',
  }
};

export default config;
