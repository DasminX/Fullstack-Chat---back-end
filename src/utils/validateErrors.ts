import { NextFunction } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import { ExtendedError } from "../types/types";

export const validateErrors = (
  validationErrorArr: Result<ValidationError>,
  errorMsg: string,
  next: NextFunction
) => {
  if (!validationErrorArr.isEmpty()) {
    next(new ExtendedError(errorMsg, 400));
  }
};
