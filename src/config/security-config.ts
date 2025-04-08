export const securityConfig = {
  session: {
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    duration: 30 * 60 * 1000, // 30 minutes
    activeDuration: 5 * 60 * 1000, // 5 minutes
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    keyVersion: 1,
  }
};
