import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../Config/index";

/**
 * Extend Express Request to carry decoded JWT payload.
 */
declare global {
  namespace Express {
    interface Request {
      user?: jwt.JwtPayload;
    }
  }
}

/**
 * JWT Bearer authentication middleware.
 * Validates the Authorization header and attaches decoded payload to req.user.
 */
export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: "No authorization header provided",
    });
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({
      success: false,
      error: "Invalid token format. Expected: Bearer <token>",
    });
    return;
  }

  const token = parts[1]!;

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded as jwt.JwtPayload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: "Token has expired",
      });
      return;
    }

    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: "Invalid token",
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: "Authentication failed",
    });
  }
}
