import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Enrollment } from '../models/Enrollment';
import { ChatMessage } from '../models/ChatMessage';

export const registerChatHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    socket.on('authenticate', async (token: string) => {
      try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access_secret') as {
          userId: string;
          role: 'participant' | 'organizer' | 'admin';
        };
        const user = await User.findById(payload.userId);
        if (!user) return socket.disconnect();
        (socket as any).user = user;
        socket.emit('authenticated');
      } catch {
        socket.disconnect();
      }
    });

    socket.on('join_event', async (eventId: string) => {
      const user = (socket as any).user;
      if (!user) return;
      if (user.role === 'participant') {
        const enrollment = await Enrollment.findOne({
          participantId: user._id,
          eventId,
          status: 'paid',
        });
        if (!enrollment) return;
      }
      socket.join(`event_${eventId}`);
    });

    socket.on('message', async (data: { eventId: string; content: string }) => {
      const user = (socket as any).user;
      if (!user) return;
      const msg = await ChatMessage.create({
        eventId: data.eventId,
        senderId: user._id,
        senderRole: user.role === 'organizer' ? 'organizer' : 'participant',
        content: data.content,
      });
      io.to(`event_${data.eventId}`).emit('message', {
        id: msg._id,
        eventId: data.eventId,
        senderId: user._id,
        senderRole: msg.senderRole,
        content: data.content,
        createdAt: msg.createdAt,
      });
    });
  });
};


