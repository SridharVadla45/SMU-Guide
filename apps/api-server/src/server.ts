// src/server.ts
import { app } from "./app.js";
import { env } from "./config/env.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupChatSocket } from "./socket/chat.socket.js";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", 
  },
});

setupChatSocket(io);

httpServer.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
