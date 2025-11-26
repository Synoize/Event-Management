import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createApp } from './app';
import { registerChatHandlers } from './sockets/chat';

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/event_management';

const app = createApp();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  },
});

registerChatHandlers(io);

async function start() {
  console.log("database connecting...");
  await mongoose.connect(MONGO_URI);
  console.log("database connected");
  server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});


