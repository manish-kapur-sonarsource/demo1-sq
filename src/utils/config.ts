export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  jwtExpiresIn: '24h',
  bcryptSaltRounds: 10,
  rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: 100,
  dbPath: process.env.DB_PATH || './tasks.db',
};
