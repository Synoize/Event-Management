import dotenv from 'dotenv';

dotenv.config();

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { registerChatHandlers } from './sockets/chat.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/event_management';

const app = createApp();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

registerChatHandlers(io);

async function start() {
  try {
    console.log("database connecting...");
    await mongoose.connect(MONGO_URI);
    console.log("database connected");
    
    server.listen(PORT, () => {
      console.log(`Server running on port: http://localhost:${PORT}`);
    });

    // Handle server errors gracefully
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
        server.listen(PORT + 1, () => {
          console.log(`Server running on port: http://localhost:${PORT + 1}`);
        });
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
