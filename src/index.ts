import express, { NextFunction, Request, Response } from "express";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
// import multer from "multer";
import authRouter from "./routes/authRoute";
import profileRouter from "./routes/profileRoute";
import { getIoServer } from "./io/ioInstance";
import { ExtendedError } from "./types/types";
import xss from "xss";

const app = express();

app.use(helmet());
app.use(cors());
app.use(xss("<p>Something went wrong!</p>")); // ?
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.EXPRESS_URLENCODED_LIMIT,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// socket.io
const server = http.createServer(app);

const io = getIoServer(server);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use(
  (error: ExtendedError, _req: Request, res: Response, _next: NextFunction) => {
    return res.status(error.statusCode || 500).json({
      status: "error",
      error,
    });
  }
);

server.listen(process.env.PORT || 3008);
