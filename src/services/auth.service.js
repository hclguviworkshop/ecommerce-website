const { User, RefreshToken } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const env = require('../config/env');

class AuthService {
  async register({ firstName, lastName, email, password }) {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      const err = new Error('Email already in use');
      err.statusCode = 409;
      throw err;
    }

    const user = await User.create({ firstName, lastName, email, password });
    return user;
  }

  async login({ email, password }, { userAgent, ipAddress } = {}) {
    const user = await User.findOne({ where: { email } });
    if (!user || !user.isActive) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    await user.update({ lastLoginAt: new Date() });

    const tokens = await this._issueTokens(user, { userAgent, ipAddress });
    return { user, ...tokens };
  }

  async refreshTokens(rawRefreshToken, { userAgent, ipAddress } = {}) {
    let payload;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      const err = new Error('Invalid or expired refresh token');
      err.statusCode = 401;
      throw err;
    }

    const stored = await RefreshToken.findOne({
      where: { token: rawRefreshToken, isRevoked: false },
    });

    if (!stored || stored.isExpired()) {
      const err = new Error('Refresh token not found or expired');
      err.statusCode = 401;
      throw err;
    }

    // Rotate token
    await stored.update({ isRevoked: true });

    const user = await User.findByPk(payload.id);
    if (!user || !user.isActive) {
      const err = new Error('User not found');
      err.statusCode = 401;
      throw err;
    }

    return this._issueTokens(user, { userAgent, ipAddress });
  }

  async logout(rawRefreshToken) {
    if (!rawRefreshToken) return;
    await RefreshToken.update(
      { isRevoked: true },
      { where: { token: rawRefreshToken } }
    );
  }

  async logoutAll(userId) {
    await RefreshToken.update({ isRevoked: true }, { where: { userId } });
  }

  async _issueTokens(user, { userAgent, ipAddress } = {}) {
    const payload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshTokenValue = generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshToken.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt,
      userAgent,
      ipAddress,
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }
}

module.exports = new AuthService();