import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { ForBiddenError } from "../errors/forbidden-error";
import { JWT_SECRET } from "../config";
import { AuthPayload } from "../dto";

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}

export function Authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    let token = req.get("Authorization");
    if (!token) {
      throw new ForBiddenError("token not provided");
    } else {
      token = token.startsWith("Bearer") ? token.split(" ")[1] : token;
      try {
        var payload = jwt.verify(token, JWT_SECRET!) as AuthPayload;
        req.currentUser = payload;
        next();
      } catch (err) {
        throw new NotAuthorizedError("Invalid token");
      }
    }
  } catch (error) {
    next(error);
  }
}
