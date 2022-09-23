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

// socket.io
// socket.io
// socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected`);

  socket.on("send-message", (data) => {
    socket.broadcast.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// api
// api
// api
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/profile", profileRouter);

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
