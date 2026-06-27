import bcrypt from 'bcryptjs';
import { prisma } from '../../config/database';
import { RedisService } from './redis.service';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';
import { ApiError } from '../../common/ApiError';

export const AuthService = {
  register: async (email: string, password: string, name?: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError('Email is already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  login: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError('Invalid email or password', 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await RedisService.storeRefreshToken(user.id, refreshToken);

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  },

  refreshTokens: async (refreshToken: string) => {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const userId = decoded.userId;

      const isValid = await RedisService.isRefreshTokenValid(userId, refreshToken);
      if (!isValid) {
        throw new ApiError('Invalid or revoked refresh token', 401);
      }

      const newAccessToken = generateAccessToken(userId);
      const newRefreshToken = generateRefreshToken(userId);

      await RedisService.revokeRefreshToken(userId, refreshToken);
      await RedisService.storeRefreshToken(userId, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error: any) {
      throw new ApiError(error.message || 'Token refresh failed', 401);
    }
  },

  logout: async (userId: string, refreshToken: string) => {
    await RedisService.revokeRefreshToken(userId, refreshToken);
  },

  getUserProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
