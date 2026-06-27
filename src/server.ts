import app from './app';
import { prisma } from './config/database';
import { connectRedis } from './config/redis';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('Connecting to Redis...');
    await connectRedis();

    console.log('Connecting to PostgreSQL...');
    await prisma.$connect();
    console.log('Connected to PostgreSQL successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
