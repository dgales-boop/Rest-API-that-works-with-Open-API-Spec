import type { Request, Response, NextFunction } from "express";

export default abstract class Controller {
  // Shared utilities for all controllers can go here,
  // e.g. a helper to send standardized JSON responses

  protected sendSuccessResponse(
    res: Response,
    data: any,
    statusCode: number = 200,
  ) {
    res.status(statusCode).json({ success: true, data });
  }

  protected sendErrorResponse(
    res: Response,
    message: string,
    statusCode: number = 500,
  ) {
    res.status(statusCode).json({ success: false, error: message });
  }
}
