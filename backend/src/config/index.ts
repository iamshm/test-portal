import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "default-secret-key",
  sessionSecret: process.env.SESSION_SECRET || "session-secret-key",
  bcryptSaltRounds: 10,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  database: {
    url: process.env.DATABASE_URL,
  },
  googleCloud: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png"],
    uploadDir: "uploads/",
  },
  security: {
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100, // Limit each IP to 100 requests per windowMs
    passwordMinLength: 8,
    sessionMaxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const;
