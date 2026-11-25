const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const rawCorsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

// "*" allows any origin (credentials still work because the requesting origin is reflected).
const allowAllOrigins = rawCorsOrigins.includes('*');

const corsOrigins = rawCorsOrigins
  .filter((value) => value !== '*')
  .map((value) => {
    try {
      return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).origin;
    } catch (_err) {
      return null;
    }
  })
  .filter(Boolean);

/**
 * Whether a browser Origin header is allowed. Requests without an Origin
 * (curl, server-to-server, health checks) are always allowed.
 * @param {string|undefined} origin
 */
function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowAllOrigins) return true;
  return corsOrigins.includes(origin.replace(/\/+$/, ''));
}

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://tms_user:tms_pass@localhost:5432/tms_db',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '7d',
  bcryptCost: parseInt(process.env.BCRYPT_COST, 10) || 12,
  corsOrigins,
  allowAllOrigins,
  isOriginAllowed,
};

module.exports = config;
