import express, { NextFunction, Request, Response } from "express";
import http from "http";
import helmet from "helmet";
import cors from "cors";
// import multer from "multer";
import authRouter from "./routes/authRoute";
import profileRouter from "./routes/profileRoute";
import { getIoServer } from "./io/ioInstance";
import { ExtendedError } from "./types/types";

const app = express();
app.use(helmet());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.EXPRESS_URLENCODED_LIMIT,
  })
);
app.use(express.json());

// socket.io
// socket.io
// socket.io
const server = http.createServer(app);

const io = getIoServer(server);

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

app.use(
  (error: ExtendedError, _req: Request, res: Response, _next: NextFunction) => {
    return res.status(error.statusCode || 500).json({
      status: "error",
      data: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
);

server.listen(process.env.PORT || 3008);
