import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';

// Routes importları (dizin yapına göre .js uzantısı önemli)
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import scenarioRoutes from './routes/scenarioRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import chatMessageRoutes from './routes/chatMessageRoutes.js';
import grammarErrorRoutes from './routes/grammarErrorRoutes.js';
import vocabularyStatRoutes from './routes/vocabularyStatRoutes.js';
import levelTestRoutes from './routes/levelTestRoutes.js';
import performanceStatRoutes from './routes/performanceStatRoutes.js';
import coordinatorRoutes from './routes/coordinatorRoutes.js';
import freeTalkChatRoutes from './routes/freeTalkChatRoutes.js';

const app = express();

// Middleware
app.use(cors({ origin: true, credentials: true })); // CORS ayarları
app.use(express.json());
app.use(cookieParser());

// Routes mount
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/chat-messages', chatMessageRoutes);
app.use('/api/grammar-errors', grammarErrorRoutes);
app.use('/api/vocabulary-stats', vocabularyStatRoutes);
app.use('/api/level-tests', levelTestRoutes);
app.use('/api/performance-stats', performanceStatRoutes);
app.use('/api/coordinator', coordinatorRoutes);
app.use('/api/free-talk-chat', freeTalkChatRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('✅ API is running');
});

// Hata yakalama middleware'i (en sona eklenmeli)
app.use(errorHandler);

export default app;
