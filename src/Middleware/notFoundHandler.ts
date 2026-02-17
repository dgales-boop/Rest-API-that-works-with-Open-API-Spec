import type { Request, Response } from "express";

/**
 * Catch-all 404 handler for unmatched routes.
 * Must be registered AFTER all route definitions but BEFORE errorHandler.
 */
export default function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
}
