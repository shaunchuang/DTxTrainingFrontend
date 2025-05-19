/**
 * Application configuration settings
 * Can be overridden by environment variables in .env files
 */

// API base URL - configurable via environment variables
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Security API endpoints
export const SECURITY_API = {
  LOGIN: `${API_BASE_URL}/security/api/login`,
  LOGOUT: `${API_BASE_URL}/security/api/logout`,
  REGISTER: `${API_BASE_URL}/security/api/register`,
  CAPTCHA: `${API_BASE_URL}/security/api/captcha`,
  USER: `${API_BASE_URL}/security/api/user`,
  REFRESH_TOKEN: `${API_BASE_URL}/security/api/refresh-token`
};

// JWT configuration
export const JWT_CONFIG = {
  TOKEN_HEADER: 'Authorization',
  TOKEN_PREFIX: 'Bearer',
  TOKEN_STORAGE_KEY: 'authToken',
  USER_STORAGE_KEY: 'user',
  // 在token到期前15分鐘刷新
  REFRESH_THRESHOLD_MS: 15 * 60 * 1000
};