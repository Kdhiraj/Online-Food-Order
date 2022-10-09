import { NextFunction, Request, Response } from "express";

export const asyncHandler =
  (fn: any) =>
  (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
