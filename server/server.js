// server.js
import app from './app.js';
import db from './models/index.js';
import config from './config/env.js';

async function startServer() {
  try {
    // Veritabanı bağlantısını doğrula
    await db.sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');

    // Opsiyonel: Senkronizasyon (sadece geliştirme ortamında kullanılmalı)
    // await db.sequelize.sync({ alter: true }); 

    // Sunucuyu başlat
    app.listen(config.node.port, () => {
      console.log(`🚀 Server is running on port ${config.node.port}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // Başarısız başlatmada uygulamayı sonlandır
  }
}

// Başlatıcı fonksiyonu çağır
startServer();
