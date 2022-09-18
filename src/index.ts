import express, { NextFunction, Request, Response } from "express";
import http from "http";
import helmet from "helmet";
import { Server } from "socket.io";

import authRouter from "./routes/authRoute";
import roomRouter from "./routes/roomRoute";
import profileRouter from "./routes/profileRoute";

const app = express();
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const server = http.createServer(app);

app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/profile", profileRouter);

// const io = new Server(server);
/* io.on("connection", (socket) => {
  console.log(`user connected`);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}); */

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const { status, message } = error;
  return res.status(status).json({
    status: "error",
    data: {
      message: message,
    },
  });
});

// SPRAWDZIC SCHEMAT PRISMY

// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING
// ZROBIC UNIWERSALNY ERROR HANDLING

server.listen(process.env.PORT || 3008);
