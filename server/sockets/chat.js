export const registerChatHandlers = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication failed'));

    // In real implementation, verify JWT token here
    // For now, just proceed

    socket.userId = socket.handshake.auth.userId;
    next();
  });

  io.on('connection', (socket) => {
    // User connected
    socket.emit('welcome', { message: 'Connected to chat server' });

    // Join event room for chatting
    socket.on('join-event', ({ eventId }) => {
      socket.join(`event-${eventId}`);
      socket.emit('joined', { message: `Joined event-${eventId}` });
    });

    // Send message
    socket.on('send-message', ({ eventId, message, senderName }) => {
      const room = `event-${eventId}`;
      socket.to(room).emit('receive-message', {
        senderId: socket.userId,
        senderName,
        message,
        timestamp: new Date(),
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      // Clean up
    });
  });
};
