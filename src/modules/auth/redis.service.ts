import { redisClient } from '../../config/redis';
import dotenv from 'dotenv';

dotenv.config();

const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const parseExpiresInSeconds = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60; // fallback to 7 days
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 24 * 60 * 60;
    default: return 7 * 24 * 60 * 60;
  }
};

const TTL_SECONDS = parseExpiresInSeconds(JWT_REFRESH_EXPIRES_IN);

export class RedisService {
  static async storeRefreshToken(userId: string, token: string): Promise<void> {
    const key = `refresh_token:${userId}:${token}`;
    await redisClient.set(key, '1', {
      EX: TTL_SECONDS,
    });
  }

  static async isRefreshTokenValid(userId: string, token: string): Promise<boolean> {
    const key = `refresh_token:${userId}:${token}`;
    const exists = await redisClient.exists(key);
    return exists === 1;
  }

  static async revokeRefreshToken(userId: string, token: string): Promise<void> {
    const key = `refresh_token:${userId}:${token}`;
    await redisClient.del(key);
  }

  static async revokeAllUserTokens(userId: string): Promise<void> {
    const pattern = `refresh_token:${userId}:*`;
    let cursor = 0;
    do {
      const reply = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = reply.cursor;
      const keys = reply.keys;
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } while (cursor !== 0);
  }
}
