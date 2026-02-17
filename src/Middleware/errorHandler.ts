import type { Request, Response, NextFunction } from "express";

/**
 * Centralized error-handling middleware.
 * Must be registered AFTER all routes.
 */
export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(`[Error] ${err.message}`, err.stack);

  const statusCode = (err as any).statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
}
