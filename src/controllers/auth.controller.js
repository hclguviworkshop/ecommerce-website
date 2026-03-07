const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response');
const env = require('../config/env');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      sendSuccess(res, { statusCode: 201, message: 'Registration successful', data: { user } });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body, {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      });
      sendSuccess(res, { message: 'Login successful', data: { user, accessToken, refreshToken } });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken: raw } = req.body;
      if (!raw) return sendError(res, { statusCode: 400, message: 'Refresh token required' });

      const tokens = await authService.refreshTokens(raw, {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      });
      sendSuccess(res, { message: 'Tokens refreshed', data: tokens });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      await authService.logout(req.body.refreshToken);
      sendSuccess(res, { message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  async logoutAll(req, res, next) {
    try {
      await authService.logoutAll(req.user.id);
      sendSuccess(res, { message: 'Logged out from all devices' });
    } catch (err) {
      next(err);
    }
  }

  async me(req, res) {
    sendSuccess(res, { data: { user: req.user } });
  }

  // Called after passport Google callback
  async googleCallback(req, res) {
    const user = req.user;
    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });
    res.redirect(`${env.frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
}

module.exports = new AuthController();