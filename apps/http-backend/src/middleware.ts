import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { JWT_SECRET } from "@repo/backend-common/config";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header missing",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.userId !== "string"
    ) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    const payload = decoded as CustomJwtPayload;

    req.userId = payload.userId;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
