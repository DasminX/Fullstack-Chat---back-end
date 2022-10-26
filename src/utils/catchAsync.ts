import { ResolveOptions } from "dns";
import { NextFunction } from "express";
import { Result, ValidationError, validationResult } from "express-validator";

export const catchAsync = (fn: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export const validateErrors = (
  validationErrorArr: Result<ValidationError>,
  errorMsg: string,
  statusCode: number
) => {
  if (!validationErrorArr.isEmpty()) {
    const error: any = new Error(errorMsg);
    error.statusCode = statusCode;
    throw error;
  }
};
