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
import rateLimit from "express-rate-limit";

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
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: "You exceeded limit of requests per hour. Please try again later.",
});
app.use(limiter);

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
