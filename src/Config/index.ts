import "dotenv/config";

const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  jwtSecret: process.env.JWT_SECRET || "default-secret",
} as const;

export default config;
