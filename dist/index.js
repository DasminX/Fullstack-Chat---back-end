"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const roomRoute_1 = __importDefault(require("./routes/roomRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
const server = http_1.default.createServer(app);
app.use("/api/auth", authRoute_1.default);
app.use("/api/rooms", roomRoute_1.default);
app.use("/api/profile", profileRoute_1.default);
// const io = new Server(server);
/* io.on("connection", (socket) => {
  console.log(`user connected`);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
}); */
app.use((error, _req, res, _next) => {
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
