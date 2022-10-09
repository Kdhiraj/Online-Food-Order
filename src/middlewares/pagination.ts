import { Request, Response, NextFunction } from "express";
import { Pagination } from "../dto";

declare global {
  namespace Express {
    interface Request {
      pagination?: Pagination;
    }
  }
}
export const pagination = (req: Request, res: Response, next: NextFunction) => {
  let requestedPage: any, requestedSize: any;
  if (req.query.page) {
    requestedPage = req.query?.page;
  }
  if (req.query.size) {
    requestedSize = req.query?.size;
  }
  const pageAsNumber = Number.parseInt(requestedPage);
  const sizeAsNumber = Number.parseInt(requestedSize);

  let page = Number.isNaN(pageAsNumber) ? 0 : pageAsNumber;
  if (page < 0) {
    page = 0;
  }
  let size = Number.isNaN(sizeAsNumber) ? 10 : sizeAsNumber;
  if (size > 10 || size < 1) {
    size = 10;
  }
  req.pagination = { page, size };
  next();
};
