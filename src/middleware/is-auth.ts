import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ExtendedError } from "../types/types";

export const isAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return next(new ExtendedError("Not authenticated!", 403));
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_TOKEN as string);
  } catch (err) {
    next(new ExtendedError("Something went wrong!", 500));
  }

  if (
    !decodedToken ||
    typeof decodedToken === "string" ||
    ("exp" in decodedToken &&
      "iat" in decodedToken &&
      decodedToken!.iat > decodedToken!.exp)
  ) {
    return next(new ExtendedError("Not authenticated!", 403));
  }

  req.userID = decodedToken.userID;

  // po zmianie hasla relog
  next();
};
