import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRoutes from "./Api/V1/Routes/api";
import authMiddleware from "./Middleware/authMiddleware";
import notFoundHandler from "./Middleware/notFoundHandler";
import errorHandler from "./Middleware/errorHandler";
import oauthRoutes from "./OAuth/oauthServer";

const app = express();

// Global middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock OAuth2 server (no auth required — this IS the auth server)
app.use("/oauth", oauthRoutes);

// JWT authentication for all API routes
app.use("/api/v1", authMiddleware);

// API routes
app.use("/api/v1", apiRoutes);

// 404 catch-all (after all routes)
app.use(notFoundHandler);

// Centralized error handler (must be last)
app.use(errorHandler);

export default app;
