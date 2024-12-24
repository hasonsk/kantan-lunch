// socket.js
import { Server } from 'socket.io';
import Notification from '../models/notificationModel.js';

const users = {};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    socket.on('register', async (userId) => {
      console.log(`User ${userId} connected`);
      users[userId] = socket.id;

      try {
        const notifications = await Notification.find({ user_id: userId, is_sent: false }).populate('from', 'username');

        notifications.forEach(async (notification) => {
          let message = '';
          if (notification.type === 'like') {
            message = `${notification.from.username} liked your post.`;
          } else if (notification.type === 'comment') {
            message = `${notification.from.username} commented on your post.`;
          }

          socket.emit('notification', {
            message,
            postId: notification.post_id,
            timestamp: notification.created_at,
          });

          notification.is_sent = true;
          await notification.save();
        });
      } catch (error) {
        console.error('Error sending notifications:', error);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          delete users[userId];
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

export { initializeSocket, users };