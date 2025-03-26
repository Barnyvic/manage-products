import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env";
import { User } from "../models/user.model";
import { errorResponse } from "../utils/apiResponse";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      errorResponse(res, "No token provided", 401);
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    User.findById(decoded.id)
      .then((user) => {
        if (!user) {
          errorResponse(res, "User not found", 401);
          return;
        }
        req.user = { id: user.id };
        next();
      })
      .catch(() => {
        errorResponse(res, "Invalid token", 401);
      });
  } catch (error) {
    errorResponse(res, "Invalid token", 401);
  }
};
