import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ApiUtils, ApiError } from '../../common/ApiError';
import { asyncHandler } from '../../common/asyncHandler';
import { AuthenticatedRequest } from './auth.middleware';

export const AuthController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    const user = await AuthService.register(email, password, name);
    return res.status(201).json(
      ApiUtils.createSuccess(user, 'User registered successfully')
    );
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError('Email and password are required', 400);
    }

    const result = await AuthService.login(email, password);
    return res.status(200).json(
      ApiUtils.createSuccess(result, 'Login successful')
    );
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ApiError('Refresh token is required', 400);
    }

    const tokens = await AuthService.refreshTokens(refreshToken);
    return res.status(200).json(
      ApiUtils.createSuccess(tokens, 'Token refreshed successfully')
    );
  }),

  logout: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { refreshToken } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError('Unauthorized', 401);
    }

    if (!refreshToken) {
      throw new ApiError('Refresh token is required to log out', 400);
    }

    await AuthService.logout(userId, refreshToken);
    return res.status(200).json(
      ApiUtils.createSuccess(null, 'Logout successful')
    );
  }),

  me: asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError('Unauthorized', 401);
    }

    const user = await AuthService.getUserProfile(userId);
    return res.status(200).json(
      ApiUtils.createSuccess(user, 'User profile retrieved successfully')
    );
  }),
};
