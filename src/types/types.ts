import { User } from "@prisma/client";
import { Response, NextFunction } from "express";
import { Result, ValidationError } from "express-validator";

export class ExtendedError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export type CreateRoomType = {
  name: string;
  logoURL: string;
  isPrivate: boolean;
  roomPassword: string;
};

export type updateUserFuncType = (
  res: Response,
  next: NextFunction,
  userID: string,
  dataToBeChanged: any,
  keyWord: string
) => void;

export type checkIfUserExistsFuncType = (
  next: NextFunction,
  userID: string
) => void;

export type validateErrorsFuncType = (
  validationErrorArr: Result<ValidationError>,
  errorMsg: string,
  next: NextFunction
) => void;

export type authCheckIfUsersExistsFuncType = (
  next: NextFunction,
  login: string,
  requestType: "LOGIN" | "REGISTER"
) => Promise<void | User>;

// IO FUNC
// IO FUNC
