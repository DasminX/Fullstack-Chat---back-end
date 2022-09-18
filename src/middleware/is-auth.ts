import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const isAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error: any = new Error("Not authenticated!");
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "kopamatakawasupersecretkeyhaha");
  } catch (err) {
    const error: any = new Error("Something went wrong!");
    error.status = 500;
    return next(error);
  }

  if (!decodedToken) {
    const error: any = new Error("Not authenticated!");
    error.status = 401;
    return next(error);
  }

  if (typeof decodedToken === "string") {
    req.userID = decodedToken;
  } else {
    req.userID = decodedToken.userID;
  }

  console.log("przechodzi przez mdlwr");
  next();
};
