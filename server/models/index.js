// models/index.js
import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath, pathToFileURL } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize(
  process.env.DB_DATABASE, // .env'de varsa: DB_DATABASE
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  }
);

const db = {};

const modelFiles = fs.readdirSync(__dirname)
  .filter(file =>
    file.endsWith('.js') &&
    file !== 'index.js' &&
    !file.startsWith('.') &&
    fs.statSync(path.join(__dirname, file)).isFile()
  );

for (const file of modelFiles) {
  const modelPath = path.join(__dirname, file);
  const modelModule = await import(pathToFileURL(modelPath).href); // ✅ doğru format
  const defineModel = modelModule.default;
  const model = defineModel(sequelize, DataTypes);
  db[model.name] = model;
}

Object.values(db)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
