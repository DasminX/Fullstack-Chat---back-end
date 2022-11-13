import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import {
  checkIfUserExists,
  updateUser,
} from "../utils/profileControllerHelpers";
import { validateErrors } from "../utils/validateErrors";

export const changeNameHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationErrorArr = validationResult(req);
    validateErrors(
      validationErrorArr,
      "Name must consist of 3-12 characters.",
      next
    );

    await checkIfUserExists(next, req.userID);
    await updateUser(
      res,
      next,
      req.userID,
      { username: req.body.changedName },
      "Username"
    );
  } catch (e) {
    next(e);
  }
};

export const changeLogoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationErrorArr = validationResult(req);
    validateErrors(validationErrorArr, "Wrong logo URL. Try again.", next);

    await checkIfUserExists(next, req.userID);
    await updateUser(
      res,
      next,
      req.userID,
      { userAvatarImgUrl: req.body.changedLogoUrl },
      "User avatar logo"
    );
  } catch (e) {
    next(e);
  }
};
